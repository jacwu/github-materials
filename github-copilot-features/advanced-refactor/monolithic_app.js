// A monolithic application that handles user authentication, product management,
// order processing, and notification in a single file with tight coupling.

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Initialize express app
const app = express();
app.use(bodyParser.json());

// Database setup (in-memory for this example)
let db = {
  users: [],
  products: [],
  orders: [],
  sessions: {}
};

// Load data from JSON files if they exist
try {
  if (fs.existsSync(path.join(__dirname, 'users.json'))) {
    db.users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json')));
  }
  if (fs.existsSync(path.join(__dirname, 'products.json'))) {
    db.products = JSON.parse(fs.readFileSync(path.join(__dirname, 'products.json')));
  }
  if (fs.existsSync(path.join(__dirname, 'orders.json'))) {
    db.orders = JSON.parse(fs.readFileSync(path.join(__dirname, 'orders.json')));
  }
} catch (err) {
  console.error('Error loading data:', err);
}

// Save data to JSON files
function saveData() {
  try {
    fs.writeFileSync(path.join(__dirname, 'users.json'), JSON.stringify(db.users, null, 2));
    fs.writeFileSync(path.join(__dirname, 'products.json'), JSON.stringify(db.products, null, 2));
    fs.writeFileSync(path.join(__dirname, 'orders.json'), JSON.stringify(db.orders, null, 2));
  } catch (err) {
    console.error('Error saving data:', err);
  }
}

// Email setup
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 587,
  secure: false,
  auth: {
    user: 'user@example.com',
    pass: 'password123'
  }
});

// Middleware for authentication
function authenticate(req, res, next) {
  const sessionId = req.headers.authorization;
  if (!sessionId || !db.sessions[sessionId]) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.user = db.sessions[sessionId];
  next();
}

// Admin middleware
function isAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}

// User Authentication Routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Check if user already exists
    if (db.users.some(u => u.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = {
      id: Date.now().toString(),
      username,
      email,
      password: hashedPassword,
      role: 'customer',
      createdAt: new Date().toISOString()
    };
    
    db.users.push(user);
    saveData();
    
    // Send welcome email
    const mailOptions = {
      from: 'noreply@example.com',
      to: email,
      subject: 'Welcome to Our Store',
      text: `Hi ${username}, thank you for registering!`
    };
    
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error('Error sending email:', error);
      }
    });
    
    res.status(201).json({ 
      message: 'User registered successfully',
      id: user.id 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = db.users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Create session
    const sessionId = Math.random().toString(36).substring(2, 15);
    db.sessions[sessionId] = {
      id: user.id,
      email: user.email,
      role: user.role
    };
    
    res.json({ 
      message: 'Login successful',
      sessionId,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/logout', (req, res) => {
  const sessionId = req.headers.authorization;
  if (sessionId && db.sessions[sessionId]) {
    delete db.sessions[sessionId];
    res.json({ message: 'Logout successful' });
  } else {
    res.status(400).json({ error: 'Not logged in' });
  }
});

// Product Management Routes
app.get('/api/products', (req, res) => {
  res.json(db.products);
});

app.get('/api/products/:id', (req, res) => {
  const product = db.products.find(p => p.id === req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.post('/api/products', authenticate, isAdmin, (req, res) => {
  try {
    const { name, price, description, inventory } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }
    
    const product = {
      id: Date.now().toString(),
      name,
      price: parseFloat(price),
      description: description || '',
      inventory: inventory || 0,
      createdAt: new Date().toISOString(),
      createdBy: req.user.id
    };
    
    db.products.push(product);
    saveData();
    
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/products/:id', authenticate, isAdmin, (req, res) => {
  try {
    const { name, price, description, inventory } = req.body;
    const productIndex = db.products.findIndex(p => p.id === req.params.id);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    db.products[productIndex] = {
      ...db.products[productIndex],
      name: name || db.products[productIndex].name,
      price: price ? parseFloat(price) : db.products[productIndex].price,
      description: description !== undefined ? description : db.products[productIndex].description,
      inventory: inventory !== undefined ? inventory : db.products[productIndex].inventory,
      updatedAt: new Date().toISOString(),
      updatedBy: req.user.id
    };
    
    saveData();
    
    res.json(db.products[productIndex]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/products/:id', authenticate, isAdmin, (req, res) => {
  try {
    const productIndex = db.products.findIndex(p => p.id === req.params.id);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Check if product is in any order
    const productInOrders = db.orders.some(order => 
      order.items.some(item => item.productId === req.params.id)
    );
    
    if (productInOrders) {
      return res.status(400).json({ error: 'Cannot delete product that is in orders' });
    }
    
    db.products.splice(productIndex, 1);
    saveData();
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Order Processing Routes
app.get('/api/orders', authenticate, (req, res) => {
  try {
    let orders;
    
    if (req.user.role === 'admin') {
      orders = db.orders;
    } else {
      orders = db.orders.filter(order => order.userId === req.user.id);
    }
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/orders', authenticate, (req, res) => {
  try {
    const { items } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must include items' });
    }
    
    // Validate items and calculate total
    let total = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = db.products.find(p => p.id === item.productId);
      
      if (!product) {
        return res.status(400).json({ error: `Product ${item.productId} not found` });
      }
      
      if (product.inventory < (item.quantity || 1)) {
        return res.status(400).json({ error: `Product ${product.name} is out of stock` });
      }
      
      const quantity = item.quantity || 1;
      const itemTotal = product.price * quantity;
      
      orderItems.push({
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity,
        total: itemTotal
      });
      
      total += itemTotal;
      
      // Update inventory
      product.inventory -= quantity;
    }
    
    // Create order
    const order = {
      id: Date.now().toString(),
      userId: req.user.id,
      items: orderItems,
      total,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    db.orders.push(order);
    saveData();
    
    // Send order confirmation email
    const user = db.users.find(u => u.id === req.user.id);
    if (user) {
      const mailOptions = {
        from: 'orders@example.com',
        to: user.email,
        subject: `Order Confirmation #${order.id}`,
        text: `Thank you for your order!\n\nOrder details:\nTotal: $${total.toFixed(2)}\n\nItems:\n${orderItems.map(i => 
          `${i.productName} - $${i.price} x ${i.quantity}`).join('\n')}`
      };
      
      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.error('Error sending order email:', error);
        }
      });
    }
    
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/orders/:id/status', authenticate, isAdmin, (req, res) => {
  try {
    const { status } = req.body;
    const orderIndex = db.orders.findIndex(o => o.id === req.params.id);
    
    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    db.orders[orderIndex].status = status;
    db.orders[orderIndex].updatedAt = new Date().toISOString();
    db.orders[orderIndex].updatedBy = req.user.id;
    
    saveData();
    
    // Notify user of status change
    const order = db.orders[orderIndex];
    const user = db.users.find(u => u.id === order.userId);
    
    if (user) {
      const mailOptions = {
        from: 'orders@example.com',
        to: user.email,
        subject: `Order #${order.id} Status Update`,
        text: `Your order status has been updated to: ${status}`
      };
      
      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.error('Error sending status update email:', error);
        }
      });
    }
    
    res.json({ 
      message: 'Order status updated',
      order: db.orders[orderIndex]
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User Management (Admin Only)
app.get('/api/users', authenticate, isAdmin, (req, res) => {
  // Remove password from response
  const users = db.users.map(user => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
  
  res.json(users);
});

app.put('/api/users/:id/role', authenticate, isAdmin, (req, res) => {
  try {
    const { role } = req.body;
    const userIndex = db.users.findIndex(u => u.id === req.params.id);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!['admin', 'customer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    
    db.users[userIndex].role = role;
    db.users[userIndex].updatedAt = new Date().toISOString();
    db.users[userIndex].updatedBy = req.user.id;
    
    // Update any active session for this user
    Object.keys(db.sessions).forEach(sessionId => {
      if (db.sessions[sessionId].id === req.params.id) {
        db.sessions[sessionId].role = role;
      }
    });
    
    saveData();
    
    // Send notification email
    const mailOptions = {
      from: 'admin@example.com',
      to: db.users[userIndex].email,
      subject: 'Your Account Role Has Changed',
      text: `Your account role has been updated to: ${role}`
    };
    
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error('Error sending role update email:', error);
      }
    });
    
    const { password, ...userWithoutPassword } = db.users[userIndex];
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reports and Analytics (Admin Only)
app.get('/api/reports/sales', authenticate, isAdmin, (req, res) => {
  try {
    const { start, end } = req.query;
    let startDate = start ? new Date(start) : new Date(0);
    let endDate = end ? new Date(end) : new Date();
    
    const filteredOrders = db.orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate <= endDate;
    });
    
    const totalSales = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const salesByProduct = {};
    
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        if (!salesByProduct[item.productId]) {
          salesByProduct[item.productId] = {
            productId: item.productId,
            productName: item.productName,
            quantity: 0,
            revenue: 0
          };
        }
        salesByProduct[item.productId].quantity += item.quantity;
        salesByProduct[item.productId].revenue += item.total;
      });
    });
    
    res.json({
      totalSales,
      orderCount: filteredOrders.length,
      salesByProduct: Object.values(salesByProduct)
    });
  } catch (error) {
    console.error('Error generating sales report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});