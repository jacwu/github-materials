
using System;
using System.Collections.Generic;

// User service class
public class UserService
{
    public void CreateUser(User user)
    {
        // Duplicate validation logic
        if (user == null)
        {
            throw new ArgumentNullException("user", "User object cannot be null");
        }

        if (string.IsNullOrEmpty(user.Name))
        {
            throw new ArgumentException("User name cannot be empty");
        }

        if (string.IsNullOrEmpty(user.Email) || !user.Email.Contains("@"))
        {
            throw new ArgumentException("Invalid email format");
        }

        if (string.IsNullOrEmpty(user.Password) || user.Password.Length < 8)
        {
            throw new ArgumentException("Password length must be at least 8 characters");
        }

        // Business logic to save user
        Console.WriteLine($"Save user: {user.Name}");
    }
}

// Product service class
public class ProductService
{
    public void CreateProduct(Product product)
    {
        // Duplicate validation logic
        if (product == null)
        {
            throw new ArgumentNullException("product", "Product object cannot be null");
        }

        if (string.IsNullOrEmpty(product.Name))
        {
            throw new ArgumentException("Product name cannot be empty");
        }

        if (product.Price <= 0)
        {
            throw new ArgumentException("Product price must be greater than 0");
        }

        // Business logic to save product
        Console.WriteLine($"Save product: {product.Name}");
    }
}

// Order service class
public class OrderService
{
    public void CreateOrder(Order order)
    {
        // Duplicate validation logic
        if (order == null)
        {
            throw new ArgumentNullException("order", "Order object cannot be null");
        }

        if (string.IsNullOrEmpty(order.OrderId))
        {
            throw new ArgumentException("Order ID cannot be empty");
        }

        if (order.Items == null || order.Items.Count == 0)
        {
            throw new ArgumentException("Order items cannot be empty");
        }

        // Business logic to save order
        Console.WriteLine($"Save order: {order.OrderId}");
    }
}

// Simple entity classes
public class User
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
}

public class Product
{
    public string Name { get; set; }
    public decimal Price { get; set; }
}

public class Order
{
    public string OrderId { get; set; }
    public List<Product> Items { get; set; }
}
