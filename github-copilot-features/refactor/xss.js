// DOM-based XSS vulnerability in frontend JavaScript

function showMessage() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
    
    // Directly insert the parameter into the DOM without any processing
    document.getElementById('message-box').innerHTML = message;
}

// Execute when the page loads
window.onload = showMessage;