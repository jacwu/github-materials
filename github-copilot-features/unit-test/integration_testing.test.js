// Integration Testing Example with Complex Dependencies
// This file demonstrates how to write integration tests for systems with multiple components

// Mocking approach: partial mocks to test integration while isolating external dependencies
const mockExternalAPI = {
  fetchData: jest.fn(),
  submitData: jest.fn()
};

// Mock external services but use real database connection for integration
jest.mock('../services/externalAPI', () => mockExternalAPI);
jest.mock('../services/metrics', () => ({
  recordMetric: jest.fn(),
  getMetrics: jest.fn()
}));

// Import real implementations for core components we want to test
const { OrderService } = require('../services/orderService');
const { PaymentProcessor } = require('../services/paymentProcessor');
const { InventoryManager } = require('../services/inventoryManager');
const { NotificationService } = require('../services/notificationService');
const { DatabaseConnection } = require('../database/connection');
const metrics = require('../services/metrics');

// Create test database connection
let dbConnection;
let orderService;
let paymentProcessor;
let inventoryManager;
let notificationService;

describe('Order Processing Integration Tests', () => {
  // Setup before all tests - connect to test database
  beforeAll(async () => {
    // Connect to test database (could be in-memory or dedicated test instance)
    dbConnection = new DatabaseConnection({
      host: 'localhost',
      database: 'test_db',
      user: 'test_user',
      password: 'test_password',
      // Flag to use mock or in-memory implementation for tests
      mockForTesting: true
    });
    
    await dbConnection.connect();
    
    // Initialize services with the test database connection
    paymentProcessor = new PaymentProcessor(dbConnection);
    inventoryManager = new InventoryManager(dbConnection);
    notificationService = new NotificationService(dbConnection);
    
    // OrderService depends on all other services
    orderService = new OrderService({
      dbConnection,
      paymentProcessor,
      inventoryManager,
      notificationService
    });
  });
  
  // Clean up after all tests
  afterAll(async () => {
    await dbConnection.disconnect();
  });
  
  // Setup before each test
  beforeEach(async () => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Clean database tables
    await dbConnection.query('DELETE FROM orders');
    await dbConnection.query('DELETE FROM inventory_transactions');
    await dbConnection.query('DELETE FROM payments');
    await dbConnection.query('DELETE FROM notifications');
    
    // Seed database with test data
    await dbConnection.query(`
      INSERT INTO products (id, name, price, inventory_count) 
      VALUES 
        (1, 'Test Product 1', 10.99, 100),
        (2, 'Test Product 2', 25.50, 50),
        (3, 'Test Product 3', 5.99, 0)
    `);
    
    await dbConnection.query(`
      INSERT INTO customers (id, name, email) 
      VALUES (1, 'Test Customer', 'test@example.com')
    `);
    
    // Set up mock external API responses
    mockExternalAPI.fetchData.mockImplementation(async (endpoint) => {
      if (endpoint === 'shipping_rates') {
        return {
          rates: [
            { service: 'standard', price: 5.99 },
            { service: 'express', price: 15.99 }
          ]
        };
      } else if (endpoint === 'tax_rates') {
        return {
          rate: 0.08 // 8% tax rate
        };
      }
      return {};
    });
    
    mockExternalAPI.submitData.mockResolvedValue({ 
      success: true, 
      transactionId: 'mock-transaction-123' 
    });
  });
  
  // Integration test: Complete order processing flow
  test('should process a complete order with payment, inventory and notification', async () => {
    // Arrange
    const orderData = {
      customerId: 1,
      items: [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 1 }
      ],
      shippingAddress: {
        street: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zip: '12345'
      },
      shippingMethod: 'standard',
      paymentDetails: {
        type: 'credit_card',
        cardNumber: '4111111111111111',
        expiryMonth: '12',
        expiryYear: '2030',
        cvv: '123'
      }
    };
    
    // Act
    const result = await orderService.createOrder(orderData);
    
    // Assert
    expect(result).toEqual(expect.objectContaining({
      success: true,
      orderId: expect.any(String),
      total: expect.any(Number),
      status: 'confirmed'
    }));
    
    // Verify that all services were called appropriately
    
    // 1. Verify inventory was checked and updated
    const inventoryCheck = await dbConnection.query(
      'SELECT * FROM inventory_transactions WHERE order_id = ?',
      [result.orderId]
    );
    expect(inventoryCheck.length).toBe(2); // Two products reserved
    
    // 2. Verify payment was processed
    const paymentRecord = await dbConnection.query(
      'SELECT * FROM payments WHERE order_id = ?',
      [result.orderId]
    );
    expect(paymentRecord.length).toBe(1);
    expect(paymentRecord[0]).toEqual(expect.objectContaining({
      status: 'completed',
      amount: result.total
    }));
    
    // 3. Verify notification was sent
    const notificationRecord = await dbConnection.query(
      'SELECT * FROM notifications WHERE reference_id = ?',
      [result.orderId]
    );
    expect(notificationRecord.length).toBeGreaterThan(0);
    expect(notificationRecord).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'order_confirmation',
          recipient: 'test@example.com'
        })
      ])
    );
    
    // 4. Verify external API was called for shipping rates
    expect(mockExternalAPI.fetchData).toHaveBeenCalledWith('shipping_rates');
    
    // 5. Verify metrics were recorded
    expect(metrics.recordMetric).toHaveBeenCalledWith(
      'order_created',
      expect.any(Object)
    );
  });
  
  // Integration test: Order with out-of-stock item
  test('should fail to create order with out-of-stock items', async () => {
    // Arrange
    const orderData = {
      customerId: 1,
      items: [
        { productId: 3, quantity: 1 } // This product has 0 inventory
      ],
      shippingAddress: {
        street: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zip: '12345'
      },
      shippingMethod: 'standard',
      paymentDetails: {
        type: 'credit_card',
        cardNumber: '4111111111111111',
        expiryMonth: '12',
        expiryYear: '2030',
        cvv: '123'
      }
    };
    
    // Act
    const result = await orderService.createOrder(orderData);
    
    // Assert
    expect(result).toEqual(expect.objectContaining({
      success: false,
      error: expect.stringContaining('out of stock'),
      code: 'INVENTORY_ERROR'
    }));
    
    // Verify no payment was processed
    const paymentRecord = await dbConnection.query(
      'SELECT * FROM payments WHERE order_id = ?',
      [result.orderId]
    );
    expect(paymentRecord.length).toBe(0);
    
    // Verify error metric was recorded
    expect(metrics.recordMetric).toHaveBeenCalledWith(
      'order_error',
      expect.objectContaining({
        errorCode: 'INVENTORY_ERROR'
      })
    );
  });
  
  // Integration test: Payment processing error
  test('should handle payment processing errors', async () => {
    // Arrange - Set up payment processor to simulate failure
    // We're using a spy to modify one method while keeping others intact
    const processPaymentSpy = jest
      .spyOn(paymentProcessor, 'processPayment')
      .mockImplementation(async () => {
        throw new Error('Payment declined: Insufficient funds');
      });
    
    const orderData = {
      customerId: 1,
      items: [
        { productId: 1, quantity: 1 }
      ],
      shippingAddress: {
        street: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zip: '12345'
      },
      shippingMethod: 'standard',
      paymentDetails: {
        type: 'credit_card',
        cardNumber: '4111111111111111',
        expiryMonth: '12',
        expiryYear: '2030',
        cvv: '123'
      }
    };
    
    // Act
    const result = await orderService.createOrder(orderData);
    
    // Assert
    expect(result).toEqual(expect.objectContaining({
      success: false,
      error: expect.stringContaining('Payment declined'),
      code: 'PAYMENT_ERROR'
    }));
    
    // Verify inventory was rolled back
    const inventoryCheck = await dbConnection.query(
      'SELECT * FROM inventory_transactions WHERE order_id = ? AND type = ?',
      [result.orderId, 'reservation_rollback']
    );
    expect(inventoryCheck.length).toBeGreaterThan(0);
    
    // Clean up spy
    processPaymentSpy.mockRestore();
  });
  
  // More integration tests...
});

// Testing transaction handling and rollbacks
describe('Transaction Handling Integration Tests', () => {
  // Test transaction isolation and rollbacks
  // ...
});

// Note: This file is a template - some imports and implementation details
// are omitted as they would be specific to your codebase
// GitHub Copilot can help you adapt this to your specific testing needs