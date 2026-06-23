// Advanced UI Testing Strategy Patterns
// This file demonstrates more advanced UI test automation patterns
// Use GitHub Copilot to help implement and extend these patterns

const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

/**
 * Page Object Pattern - Base Page
 * Provides common functionality for all page objects
 */
class BasePage {
  constructor(driver) {
    this.driver = driver;
    this.timeout = 10000; // Default timeout
  }
  
  /**
   * Navigate to a specific URL
   * @param {string} url - URL to navigate to
   * @returns {Promise<void>}
   */
  async navigate(url) {
    await this.driver.get(url);
  }
  
  /**
   * Find an element using various locator strategies
   * @param {Object} locator - Element locator
   * @returns {Promise<WebElement>}
   */
  async findElement(locator) {
    return await this.driver.findElement(locator);
  }
  
  /**
   * Find multiple elements
   * @param {Object} locator - Elements locator
   * @returns {Promise<WebElement[]>}
   */
  async findElements(locator) {
    return await this.driver.findElements(locator);
  }
  
  /**
   * Wait for an element to be visible
   * @param {Object} locator - Element locator
   * @param {number} timeout - Wait timeout
   * @returns {Promise<WebElement>}
   */
  async waitForElementVisible(locator, timeout = this.timeout) {
    return await this.driver.wait(until.elementLocated(locator), timeout);
  }
  
  /**
   * Wait for an element to be clickable
   * @param {Object} locator - Element locator
   * @param {number} timeout - Wait timeout
   * @returns {Promise<WebElement>}
   */
  async waitForElementClickable(locator, timeout = this.timeout) {
    const element = await this.waitForElementVisible(locator, timeout);
    return await this.driver.wait(until.elementIsEnabled(element), timeout);
  }
  
  /**
   * Click an element
   * @param {Object} locator - Element locator
   * @returns {Promise<void>}
   */
  async click(locator) {
    const element = await this.waitForElementClickable(locator);
    await element.click();
  }
  
  /**
   * Type text into an input field
   * @param {Object} locator - Element locator
   * @param {string} text - Text to type
   * @returns {Promise<void>}
   */
  async type(locator, text) {
    const element = await this.waitForElementVisible(locator);
    await element.clear();
    await element.sendKeys(text);
  }
  
  /**
   * Get text from an element
   * @param {Object} locator - Element locator
   * @returns {Promise<string>}
   */
  async getText(locator) {
    const element = await this.waitForElementVisible(locator);
    return await element.getText();
  }
  
  /**
   * Check if an element exists
   * @param {Object} locator - Element locator
   * @returns {Promise<boolean>}
   */
  async isElementPresent(locator) {
    try {
      await this.driver.findElement(locator);
      return true;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Take a screenshot and save it
   * @param {string} fileName - File name for the screenshot
   * @returns {Promise<void>}
   */
  async takeScreenshot(fileName) {
    const screenshot = await this.driver.takeScreenshot();
    require('fs').writeFileSync(fileName, screenshot, 'base64');
  }
}

/**
 * Page Object Pattern - Login Page
 */
class LoginPage extends BasePage {
  constructor(driver) {
    super(driver);
    // Define page elements
    this.usernameInput = By.id('username');
    this.passwordInput = By.id('password');
    this.loginButton = By.css('button[type="submit"]');
    this.errorMessage = By.className('error-message');
    this.forgotPasswordLink = By.linkText('Forgot Password?');
  }
  
  /**
   * Navigate to login page
   * @returns {Promise<void>}
   */
  async navigateToLoginPage() {
    await this.navigate('https://example.com/login');
  }
  
  /**
   * Perform login
   * @param {string} username - Username
   * @param {string} password - Password
   * @returns {Promise<void>}
   */
  async login(username, password) {
    await this.type(this.usernameInput, username);
    await this.type(this.passwordInput, password);
    await this.click(this.loginButton);
  }
  
  /**
   * Get error message text
   * @returns {Promise<string>}
   */
  async getErrorMessage() {
    if (await this.isElementPresent(this.errorMessage)) {
      return await this.getText(this.errorMessage);
    }
    return '';
  }
  
  /**
   * Click forgot password link
   * @returns {Promise<void>}
   */
  async clickForgotPassword() {
    await this.click(this.forgotPasswordLink);
  }
}

/**
 * Page Object Pattern - Dashboard Page
 */
class DashboardPage extends BasePage {
  constructor(driver) {
    super(driver);
    // Define page elements
    this.welcomeMessage = By.className('welcome-message');
    this.userProfileLink = By.id('user-profile');
    this.logoutButton = By.id('logout');
    this.navigationMenu = By.id('main-nav');
    this.notificationIcon = By.className('notifications');
    this.notificationCount = By.css('.notifications .count');
  }
  
  /**
   * Check if user is logged in
   * @returns {Promise<boolean>}
   */
  async isLoggedIn() {
    return await this.isElementPresent(this.welcomeMessage);
  }
  
  /**
   * Get welcome message text
   * @returns {Promise<string>}
   */
  async getWelcomeMessage() {
    return await this.getText(this.welcomeMessage);
  }
  
  /**
   * Click on a specific navigation item
   * @param {string} navItemText - Navigation item text
   * @returns {Promise<void>}
   */
  async navigateTo(navItemText) {
    const navItemLocator = By.xpath(`//nav[@id='main-nav']//a[text()='${navItemText}']`);
    await this.click(navItemLocator);
  }
  
  /**
   * Get notification count
   * @returns {Promise<number>}
   */
  async getNotificationCount() {
    if (await this.isElementPresent(this.notificationCount)) {
      const countText = await this.getText(this.notificationCount);
      return parseInt(countText, 10) || 0;
    }
    return 0;
  }
  
  /**
   * Logout
   * @returns {Promise<void>}
   */
  async logout() {
    await this.click(this.logoutButton);
  }
}

/**
 * Strategy Pattern - Test Data Strategy
 */
class TestDataStrategy {
  /**
   * Get test data for a specific test case
   * @param {string} testCase - Test case identifier
   * @returns {Object} - Test data
   */
  getTestData(testCase) {
    throw new Error('Method not implemented');
  }
}

/**
 * Concrete Strategy - Hardcoded Test Data
 */
class HardcodedTestDataStrategy extends TestDataStrategy {
  getTestData(testCase) {
    const testDataMap = {
      'validLogin': {
        username: 'testuser',
        password: 'Password123',
        expectedMessage: 'Welcome, Test User!'
      },
      'invalidLogin': {
        username: 'testuser',
        password: 'wrongpassword',
        expectedError: 'Invalid username or password'
      },
      'emptyCredentials': {
        username: '',
        password: '',
        expectedError: 'Username and password are required'
      }
    };
    
    return testDataMap[testCase] || {};
  }
}

/**
 * Concrete Strategy - CSV Test Data
 */
class CsvTestDataStrategy extends TestDataStrategy {
  constructor(filePath) {
    super();
    this.filePath = filePath;
    this.testData = this.loadTestData();
  }
  
  loadTestData() {
    // In a real implementation, this would parse a CSV file
    // For this example, we'll return a mock object
    return {
      'validLogin': {
        username: 'csvuser',
        password: 'CsvPassword123',
        expectedMessage: 'Welcome, CSV User!'
      },
      'invalidLogin': {
        username: 'csvuser',
        password: 'wrongpassword',
        expectedError: 'Invalid username or password'
      }
    };
  }
  
  getTestData(testCase) {
    return this.testData[testCase] || {};
  }
}

/**
 * Concrete Strategy - API Test Data
 */
class ApiTestDataStrategy extends TestDataStrategy {
  constructor(apiUrl) {
    super();
    this.apiUrl = apiUrl;
  }
  
  async getTestData(testCase) {
    // In a real implementation, this would make an API call
    // For this example, we'll return a mock object
    return {
      'validLogin': {
        username: 'apiuser',
        password: 'ApiPassword123',
        expectedMessage: 'Welcome, API User!'
      }
    };
  }
}

/**
 * Command Pattern - UI Commands
 */
class UICommand {
  execute() {
    throw new Error('Method not implemented');
  }
}

/**
 * Concrete Command - Login Command
 */
class LoginCommand extends UICommand {
  constructor(loginPage, username, password) {
    super();
    this.loginPage = loginPage;
    this.username = username;
    this.password = password;
  }
  
  async execute() {
    await this.loginPage.navigateToLoginPage();
    await this.loginPage.login(this.username, this.password);
  }
}

/**
 * Concrete Command - Logout Command
 */
class LogoutCommand extends UICommand {
  constructor(dashboardPage) {
    super();
    this.dashboardPage = dashboardPage;
  }
  
  async execute() {
    await this.dashboardPage.logout();
  }
}

/**
 * Observer Pattern - Test Event Listener
 */
class TestEventListener {
  onTestStart(testName) {}
  onTestPass(testName, duration) {}
  onTestFail(testName, error) {}
  onScreenshot(testName, screenshotPath) {}
}

/**
 * Concrete Observer - Console Reporter
 */
class ConsoleReporter extends TestEventListener {
  onTestStart(testName) {
    console.log(`[TEST START] ${testName}`);
  }
  
  onTestPass(testName, duration) {
    console.log(`[TEST PASS] ${testName} (${duration}ms)`);
  }
  
  onTestFail(testName, error) {
    console.error(`[TEST FAIL] ${testName}: ${error.message}`);
  }
  
  onScreenshot(testName, screenshotPath) {
    console.log(`[SCREENSHOT] ${testName}: ${screenshotPath}`);
  }
}

/**
 * Test Runner with advanced patterns
 */
class AdvancedTestRunner {
  constructor(testDataStrategy) {
    this.driver = null;
    this.testDataStrategy = testDataStrategy;
    this.listeners = [];
  }
  
  /**
   * Add a test event listener
   * @param {TestEventListener} listener - Event listener
   */
  addListener(listener) {
    this.listeners.push(listener);
  }
  
  /**
   * Notify all listeners of test start
   * @param {string} testName - Test name
   */
  notifyTestStart(testName) {
    this.listeners.forEach(listener => listener.onTestStart(testName));
  }
  
  /**
   * Notify all listeners of test pass
   * @param {string} testName - Test name
   * @param {number} duration - Test duration in ms
   */
  notifyTestPass(testName, duration) {
    this.listeners.forEach(listener => listener.onTestPass(testName, duration));
  }
  
  /**
   * Notify all listeners of test failure
   * @param {string} testName - Test name
   * @param {Error} error - Test error
   */
  notifyTestFail(testName, error) {
    this.listeners.forEach(listener => listener.onTestFail(testName, error));
  }
  
  /**
   * Notify all listeners of screenshot
   * @param {string} testName - Test name
   * @param {string} screenshotPath - Screenshot path
   */
  notifyScreenshot(testName, screenshotPath) {
    this.listeners.forEach(listener => listener.onScreenshot(testName, screenshotPath));
  }
  
  /**
   * Set up test environment
   */
  async setup() {
    this.driver = await new Builder().forBrowser('chrome').build();
    await this.driver.manage().window().maximize();
    await this.driver.manage().setTimeouts({ implicit: 5000 });
  }
  
  /**
   * Tear down test environment
   */
  async teardown() {
    if (this.driver) {
      await this.driver.quit();
    }
  }
  
  /**
   * Take a screenshot on failure
   * @param {string} testName - Test name
   */
  async takeScreenshotOnFailure(testName) {
    const screenshotPath = `./screenshots/${testName}_${Date.now()}.png`;
    await this.driver.takeScreenshot()
      .then(data => {
        require('fs').writeFileSync(screenshotPath, data, 'base64');
        this.notifyScreenshot(testName, screenshotPath);
      })
      .catch(err => console.error('Failed to take screenshot:', err));
  }
  
  /**
   * Run a test with timing and reporting
   * @param {string} testName - Test name
   * @param {Function} testFn - Test function
   */
  async runTest(testName, testFn) {
    this.notifyTestStart(testName);
    const startTime = Date.now();
    
    try {
      await testFn();
      const duration = Date.now() - startTime;
      this.notifyTestPass(testName, duration);
    } catch (error) {
      await this.takeScreenshotOnFailure(testName);
      this.notifyTestFail(testName, error);
      throw error;
    }
  }
  
  /**
   * Run all tests
   */
  async runAllTests() {
    try {
      await this.setup();
      
      // Create page objects
      const loginPage = new LoginPage(this.driver);
      const dashboardPage = new DashboardPage(this.driver);
      
      // Run test cases
      await this.runTest('validLoginTest', async () => {
        const testData = this.testDataStrategy.getTestData('validLogin');
        
        // Use command pattern
        const loginCommand = new LoginCommand(loginPage, testData.username, testData.password);
        await loginCommand.execute();
        
        // Verify successful login
        assert.strictEqual(
          await dashboardPage.isLoggedIn(), 
          true, 
          'User should be logged in'
        );
        
        const welcomeMessage = await dashboardPage.getWelcomeMessage();
        assert.strictEqual(
          welcomeMessage,
          testData.expectedMessage,
          'Welcome message should match expected message'
        );
        
        // Use command pattern for logout
        const logoutCommand = new LogoutCommand(dashboardPage);
        await logoutCommand.execute();
      });
      
      await this.runTest('invalidLoginTest', async () => {
        const testData = this.testDataStrategy.getTestData('invalidLogin');
        
        await loginPage.navigateToLoginPage();
        await loginPage.login(testData.username, testData.password);
        
        const errorMessage = await loginPage.getErrorMessage();
        assert.strictEqual(
          errorMessage,
          testData.expectedError,
          'Error message should match expected message'
        );
      });
      
    } finally {
      await this.teardown();
    }
  }
}

// Example usage
async function main() {
  // Use hardcoded test data strategy
  const testDataStrategy = new HardcodedTestDataStrategy();
  
  // Create test runner
  const testRunner = new AdvancedTestRunner(testDataStrategy);
  
  // Add console reporter
  testRunner.addListener(new ConsoleReporter());
  
  // Run all tests
  await testRunner.runAllTests();
}

// Uncomment to run:
// main().catch(console.error);

module.exports = {
  BasePage,
  LoginPage,
  DashboardPage,
  TestDataStrategy,
  HardcodedTestDataStrategy,
  CsvTestDataStrategy,
  ApiTestDataStrategy,
  UICommand,
  LoginCommand,
  LogoutCommand,
  TestEventListener,
  ConsoleReporter,
  AdvancedTestRunner
};