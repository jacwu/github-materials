// This is an example of legacy service code that could benefit from advanced refactoring
// It contains multiple code smells and anti-patterns that GitHub Copilot can help identify and fix

// Global variables and state
var users = [];
var orders = [];
var currentStatus = 'idle';

// Helper functions
function checkUserPermission(userId, action) {
  var user = null;
  for (var i = 0; i < users.length; i++) {
    if (users[i].id === userId) {
      user = users[i];
      break;
    }
  }
  
  if (user === null) {
    return false;
  }
  
  if (action === 'view') {
    return user.role === 'admin' || user.role === 'viewer' || user.role === 'editor';
  } else if (action === 'edit') {
    return user.role === 'admin' || user.role === 'editor';
  } else if (action === 'delete') {
    return user.role === 'admin';
  } else {
    return false;
  }
}

// Main service functions
function addUser(id, name, email, role) {
  if (!id || !name || !email) {
    console.error('Missing required fields');
    return false;
  }
  
  for (var i = 0; i < users.length; i++) {
    if (users[i].id === id) {
      console.error('User already exists');
      return false;
    }
  }
  
  currentStatus = 'adding';
  
  // Simulate API call delay
  setTimeout(function() {
    users.push({
      id: id,
      name: name,
      email: email,
      role: role || 'viewer',
      createdAt: new Date().toISOString()
    });
    
    currentStatus = 'idle';
    console.log('User added successfully');
  }, 100);
  
  return true;
}

function getUser(id) {
  for (var i = 0; i < users.length; i++) {
    if (users[i].id === id) {
      return users[i];
    }
  }
  return null;
}

function deleteUser(userId, requestingUserId) {
  if (!checkUserPermission(requestingUserId, 'delete')) {
    console.error('Permission denied');
    return false;
  }
  
  var userIndex = -1;
  for (var i = 0; i < users.length; i++) {
    if (users[i].id === userId) {
      userIndex = i;
      break;
    }
  }
  
  if (userIndex === -1) {
    console.error('User not found');
    return false;
  }
  
  // Check if user has orders
  var hasOrders = false;
  for (var i = 0; i < orders.length; i++) {
    if (orders[i].userId === userId) {
      hasOrders = true;
      break;
    }
  }
  
  if (hasOrders) {
    console.error('Cannot delete user with orders');
    return false;
  }
  
  currentStatus = 'deleting';
  
  // Simulate API call delay
  setTimeout(function() {
    users.splice(userIndex, 1);
    currentStatus = 'idle';
    console.log('User deleted successfully');
  }, 100);
  
  return true;
}

function createOrder(userId, items, quantity) {
  var user = getUser(userId);
  if (!user) {
    console.error('User not found');
    return false;
  }
  
  if (!items || !quantity) {
    console.error('Missing order details');
    return false;
  }
  
  currentStatus = 'ordering';
  
  // Simulate API call delay
  setTimeout(function() {
    var order = {
      id: 'order_' + Date.now(),
      userId: userId,
      items: items,
      quantity: quantity,
      status: 'created',
      createdAt: new Date().toISOString()
    };
    
    orders.push(order);
    currentStatus = 'idle';
    console.log('Order created successfully');
  }, 100);
  
  return true;
}

function getOrdersByUser(userId, requestingUserId) {
  if (!checkUserPermission(requestingUserId, 'view')) {
    console.error('Permission denied');
    return null;
  }
  
  var userOrders = [];
  for (var i = 0; i < orders.length; i++) {
    if (orders[i].userId === userId) {
      userOrders.push(orders[i]);
    }
  }
  
  return userOrders;
}

// Service status
function getStatus() {
  return currentStatus;
}

// Module exports (CommonJS style)
module.exports = {
  addUser: addUser,
  getUser: getUser,
  deleteUser: deleteUser,
  createOrder: createOrder,
  getOrdersByUser: getOrdersByUser,
  getStatus: getStatus
};