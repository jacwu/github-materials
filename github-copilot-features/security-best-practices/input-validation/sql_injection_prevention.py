# SQL Injection Prevention Example
# This file demonstrates how to prevent SQL injection attacks
# Use GitHub Copilot to implement proper database access patterns

import sqlite3
from typing import List, Dict, Any, Optional, Union


class DatabaseManager:
    """
    Database manager with examples of vulnerable and secure database operations.
    This class demonstrates how to prevent SQL injection vulnerabilities.
    
    Use GitHub Copilot to:
    1. Identify vulnerable code patterns
    2. Fix the vulnerable functions
    3. Add proper input validation and parameterization
    """
    
    def __init__(self, db_path: str):
        """Initialize the database connection"""
        self.db_path = db_path
        self.connection = None
    
    def connect(self) -> None:
        """Establish database connection"""
        self.connection = sqlite3.connect(self.db_path)
        self.connection.row_factory = sqlite3.Row
    
    def close(self) -> None:
        """Close database connection if open"""
        if self.connection:
            self.connection.close()
            self.connection = None
    
    # VULNERABLE FUNCTION - DO NOT USE
    def get_user_vulnerable(self, username: str) -> Dict[str, Any]:
        """
        VULNERABLE TO SQL INJECTION - DO NOT USE
        Demonstrates vulnerable SQL query construction
        
        Args:
            username: Username to search for
            
        Returns:
            User data as dictionary
        """
        if not self.connection:
            self.connect()
            
        cursor = self.connection.cursor()
        
        # VULNERABLE: Direct string concatenation in SQL query
        query = f"SELECT id, username, email, role FROM users WHERE username = '{username}'"
        cursor.execute(query)
        
        user = cursor.fetchone()
        if user:
            return dict(user)
        return {}
    
    # TODO: Implement the secure version of get_user
    def get_user_secure(self, username: str) -> Dict[str, Any]:
        """
        Secure version of user retrieval
        Uses parameterized queries to prevent SQL injection
        
        Args:
            username: Username to search for
            
        Returns:
            User data as dictionary
        """
        # TODO: Implement secure parameterized query
        pass
    
    # VULNERABLE FUNCTION - DO NOT USE
    def search_products_vulnerable(self, search_term: str) -> List[Dict[str, Any]]:
        """
        VULNERABLE TO SQL INJECTION - DO NOT USE
        Demonstrates vulnerable SQL search implementation
        
        Args:
            search_term: Term to search for in products
            
        Returns:
            List of matching products
        """
        if not self.connection:
            self.connect()
            
        cursor = self.connection.cursor()
        
        # VULNERABLE: Direct string concatenation with minimal escaping
        search_term = search_term.replace("'", "''")  # Inadequate protection!
        query = f"SELECT * FROM products WHERE name LIKE '%{search_term}%' OR description LIKE '%{search_term}%'"
        cursor.execute(query)
        
        results = cursor.fetchall()
        return [dict(row) for row in results]
    
    # TODO: Implement the secure version of search_products
    def search_products_secure(self, search_term: str) -> List[Dict[str, Any]]:
        """
        Secure version of product search
        Uses parameterized queries to prevent SQL injection
        
        Args:
            search_term: Term to search for in products
            
        Returns:
            List of matching products
        """
        # TODO: Implement secure parameterized search
        pass
    
    # VULNERABLE FUNCTION - DO NOT USE
    def update_user_profile_vulnerable(self, user_id: int, data: Dict[str, Any]) -> bool:
        """
        VULNERABLE TO SQL INJECTION - DO NOT USE
        Demonstrates vulnerable dynamic SQL query building
        
        Args:
            user_id: ID of user to update
            data: Dictionary of fields to update
            
        Returns:
            True if update successful
        """
        if not self.connection:
            self.connect()
            
        cursor = self.connection.cursor()
        
        # VULNERABLE: Constructing query from user-provided dictionary keys and values
        set_clauses = []
        for key, value in data.items():
            # Inadequate escaping and validation
            escaped_value = str(value).replace("'", "''")
            set_clauses.append(f"{key} = '{escaped_value}'")
        
        set_clause = ", ".join(set_clauses)
        query = f"UPDATE users SET {set_clause} WHERE id = {user_id}"
        
        cursor.execute(query)
        self.connection.commit()
        return cursor.rowcount > 0
    
    # TODO: Implement the secure version of update_user_profile
    def update_user_profile_secure(self, user_id: int, data: Dict[str, Any]) -> bool:
        """
        Secure version of user profile update
        Uses parameterized queries and validates field names
        
        Args:
            user_id: ID of user to update
            data: Dictionary of fields to update
            
        Returns:
            True if update successful
        """
        # TODO: Implement secure parameterized update
        # 1. Validate field names against whitelist
        # 2. Use parameterized queries for values
        # 3. Handle data types appropriately
        pass
    
    # Additional functions to implement:
    # TODO: Implement secure batch operation function
    # TODO: Implement function to safely handle dynamic sorting
    # TODO: Implement function to safely execute raw queries for admin purposes


# Example setup code
def create_test_database(db_path: str) -> None:
    """Create a test database with sample tables"""
    connection = sqlite3.connect(db_path)
    cursor = connection.cursor()
    
    # Create users table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL
    )
    ''')
    
    # Create products table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        category TEXT
    )
    ''')
    
    # Add sample data
    cursor.execute('''
    INSERT OR IGNORE INTO users (username, email, password, role)
    VALUES 
        ('admin', 'admin@example.com', 'hashed_password_here', 'admin'),
        ('user1', 'user1@example.com', 'hashed_password_here', 'user')
    ''')
    
    cursor.execute('''
    INSERT OR IGNORE INTO products (name, description, price, category)
    VALUES 
        ('Laptop', 'High performance laptop', 999.99, 'Electronics'),
        ('Smartphone', 'Latest model', 699.99, 'Electronics'),
        ('Headphones', 'Noise cancelling', 199.99, 'Accessories')
    ''')
    
    connection.commit()
    connection.close()


# Example usage (uncomment to test)
"""
if __name__ == "__main__":
    import os
    
    # Create test database
    db_path = "test_database.db"
    if not os.path.exists(db_path):
        create_test_database(db_path)
    
    # Initialize manager
    db_manager = DatabaseManager(db_path)
    
    # Example of secure vs vulnerable
    print("SECURE QUERY:")
    user = db_manager.get_user_secure("admin")
    print(user)
    
    print("\nSECURE SEARCH:")
    products = db_manager.search_products_secure("laptop")
    print(products)
    
    # DO NOT run vulnerable examples in production!
    # These are for demonstration purposes only
    print("\nVULNERABLE QUERY - DON'T USE:")
    # This should be safe:
    user = db_manager.get_user_vulnerable("admin")
    print(user)
    
    # But this would be vulnerable:
    # malicious = "admin' OR '1'='1"
    # user = db_manager.get_user_vulnerable(malicious)
    # print(user)
    
    db_manager.close()
"""