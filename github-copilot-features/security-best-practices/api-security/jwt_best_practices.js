// JWT Best Practices for Secure API Authentication
// This file demonstrates secure JWT implementation patterns
// Use GitHub Copilot to improve and complete the implementation

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * JWT Manager - Handles secure creation and validation of JWTs
 * Demonstrates best practices for JWT usage in API authentication
 */
class JWTManager {
  /**
   * Initialize the JWT Manager
   * 
   * @param {Object} options - Configuration options
   * @param {string} options.algorithm - JWT signing algorithm (default: 'RS256')
   * @param {number} options.expiresIn - Token expiration in seconds (default: 1 hour)
   * @param {string} options.issuer - Token issuer identifier
   * @param {string} options.audience - Token audience
   */
  constructor(options = {}) {
    this.algorithm = options.algorithm || 'RS256';
    this.expiresIn = options.expiresIn || 3600; // 1 hour default
    this.issuer = options.issuer;
    this.audience = options.audience;
    
    // For RS256, we need to load public and private keys
    if (this.algorithm.startsWith('RS') || this.algorithm.startsWith('ES')) {
      this.privateKey = null;
      this.publicKey = null;
      // Keys should be loaded securely
      // TODO: Implement secure key loading
    } else {
      // For HMAC algorithms (HS256, HS384, HS512)
      this.secretKey = null;
      // TODO: Implement secure secret management
    }
  }
  
  /**
   * Load RSA keys from files or environment
   * 
   * @param {Object} options - Key options
   * @param {string} options.privateKeyPath - Path to private key file
   * @param {string} options.publicKeyPath - Path to public key file
   */
  loadKeys(options = {}) {
    // TODO: Implement secure key loading
    // Consider environment variables for cloud environments
    // Validate key formats and requirements
  }
  
  /**
   * Generate a random secure secret key for HMAC algorithms
   * 
   * @param {number} bytes - Number of bytes for the key (default: 64)
   * @returns {string} - Base64 encoded secret key
   */
  generateSecretKey(bytes = 64) {
    // TODO: Implement secure random key generation
  }
  
  /**
   * Create a JWT token for a user
   * 
   * @param {Object} payload - Token payload with user information
   * @param {string} payload.sub - Subject (user identifier)
   * @param {Array} payload.roles - User roles for authorization
   * @param {Object} additionalClaims - Additional claims to include
   * @returns {string} - Signed JWT token
   */
  createToken(payload, additionalClaims = {}) {
    // TODO: Implement secure token creation
    // 1. Verify required payload fields
    // 2. Add standard claims (iat, exp, iss, aud, etc.)
    // 3. Add protection against common attacks (jti, nonce)
    // 4. Sign with appropriate key based on algorithm
  }
  
  /**
   * Verify and decode a JWT token
   * 
   * @param {string} token - JWT token to verify
   * @returns {Object} - Decoded token payload or null if invalid
   */
  verifyToken(token) {
    // TODO: Implement secure token verification
    // 1. Verify signature using appropriate key
    // 2. Validate standard claims (exp, nbf, iss, aud)
    // 3. Check token type and other security requirements
  }
  
  /**
   * Parse a token without verifying signature (for debugging only)
   * 
   * @param {string} token - JWT token to parse
   * @returns {Object} - Decoded token parts
   */
  parseToken(token) {
    // TODO: Implement token parsing
    // Warning: This does not validate the token!
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }
      
      return {
        header: JSON.parse(Buffer.from(parts[0], 'base64').toString()),
        payload: JSON.parse(Buffer.from(parts[1], 'base64').toString()),
        signature: parts[2]
      };
    } catch (error) {
      return null;
    }
  }
  
  /**
   * Create a refresh token
   * 
   * @param {string} userId - User identifier
   * @param {string} tokenId - ID of the access token
   * @returns {string} - Refresh token
   */
  createRefreshToken(userId, tokenId) {
    // TODO: Implement secure refresh token creation
    // Consider using different signing key and longer expiration
  }
  
  /**
   * Rotate signing keys
   * 
   * @returns {boolean} - True if keys were rotated successfully
   */
  rotateKeys() {
    // TODO: Implement key rotation
    // Important for long-term security
  }
}

/**
 * JWT Middleware Factory
 * Creates Express middleware for JWT authentication
 * 
 * @param {JWTManager} jwtManager - Configured JWT manager
 * @param {Object} options - Middleware options
 * @returns {Function} - Express middleware function
 */
function createJWTMiddleware(jwtManager, options = {}) {
  // TODO: Implement JWT authentication middleware
  // 1. Extract token from request (Authorization header, query param, etc.)
  // 2. Verify the token
  // 3. Handle errors appropriately
  // 4. Add user information to request object
}

// Example usage (uncomment to test):
/*
// Create JWT manager with appropriate options
const jwtManager = new JWTManager({
  algorithm: 'RS256',
  expiresIn: 3600,
  issuer: 'https://api.example.com',
  audience: 'https://app.example.com'
});

// Load keys (in a real app, store these securely)
jwtManager.loadKeys({
  privateKeyPath: path.join(__dirname, 'private.pem'),
  publicKeyPath: path.join(__dirname, 'public.pem')
});

// Create a token
const token = jwtManager.createToken({
  sub: 'user123',
  roles: ['user'],
  email: 'user@example.com'
});

console.log('Generated token:', token);

// Verify the token
const decoded = jwtManager.verifyToken(token);
console.log('Verified token payload:', decoded);

// Create Express middleware
const express = require('express');
const app = express();

// Apply JWT authentication middleware
app.use('/api/protected', createJWTMiddleware(jwtManager));

// Protected route
app.get('/api/protected/data', (req, res) => {
  res.json({ 
    message: 'Protected data', 
    user: req.user 
  });
});
*/

module.exports = {
  JWTManager,
  createJWTMiddleware
};