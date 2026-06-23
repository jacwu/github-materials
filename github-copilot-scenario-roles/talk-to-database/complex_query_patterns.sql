-- Complex SQL Query Patterns
-- This file contains examples of advanced SQL patterns that GitHub Copilot can help generate and explain
-- Use these examples to learn how to leverage Copilot for complex database operations

-- 1. Advanced Analytical Query with Window Functions
-- This query analyzes customer purchasing patterns with window functions

-- Calculate customer purchasing patterns, identifying big spenders and their trends
WITH customer_spending AS (
    SELECT 
        c.customer_id,
        c.first_name,
        c.last_name,
        COUNT(o.order_id) AS order_count,
        SUM(o.total_amount) AS total_spent,
        AVG(o.total_amount) AS avg_order_value,
        MAX(o.order_date) AS last_order_date,
        MIN(o.order_date) AS first_order_date
    FROM 
        customers c
    JOIN 
        orders o ON c.customer_id = o.customer_id
    WHERE 
        o.order_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 YEAR)
    GROUP BY 
        c.customer_id,
        c.first_name,
        c.last_name
),
customer_segments AS (
    SELECT 
        *,
        NTILE(4) OVER (ORDER BY total_spent DESC) AS spending_quartile,
        RANK() OVER (ORDER BY total_spent DESC) AS spending_rank,
        DENSE_RANK() OVER (ORDER BY order_count DESC) AS frequency_rank,
        total_spent / NULLIF(DATEDIFF(last_order_date, first_order_date), 0) * 30 AS monthly_avg_spend,
        DATEDIFF(CURRENT_DATE(), last_order_date) AS days_since_last_order
    FROM 
        customer_spending
)
SELECT 
    customer_id,
    first_name,
    last_name,
    order_count,
    total_spent,
    avg_order_value,
    CASE 
        WHEN spending_quartile = 1 THEN 'Top Spender'
        WHEN spending_quartile = 2 THEN 'High Value'
        WHEN spending_quartile = 3 THEN 'Medium Value'
        WHEN spending_quartile = 4 THEN 'Low Value'
    END AS customer_value_segment,
    CASE
        WHEN days_since_last_order <= 30 THEN 'Active'
        WHEN days_since_last_order <= 90 THEN 'Recent'
        WHEN days_since_last_order <= 365 THEN 'Lapsed'
        ELSE 'Inactive'
    END AS recency_segment,
    CASE
        WHEN order_count >= 10 THEN 'Frequent'
        WHEN order_count >= 5 THEN 'Regular'
        ELSE 'Occasional'
    END AS frequency_segment,
    monthly_avg_spend,
    last_order_date,
    days_since_last_order
FROM 
    customer_segments
ORDER BY 
    total_spent DESC;

-- 2. Hierarchical Data Query with Common Table Expressions (CTE)
-- Example: Employee organizational hierarchy with recursive CTE

WITH RECURSIVE employee_hierarchy AS (
    -- Base case: top level managers (employees with no manager)
    SELECT 
        employee_id,
        first_name,
        last_name,
        position,
        manager_id,
        0 AS level,
        CAST(employee_id AS CHAR(200)) AS path
    FROM 
        employees
    WHERE 
        manager_id IS NULL
    
    UNION ALL
    
    -- Recursive case: employees with managers
    SELECT 
        e.employee_id,
        e.first_name,
        e.last_name,
        e.position,
        e.manager_id,
        eh.level + 1,
        CONCAT(eh.path, ',', e.employee_id) AS path
    FROM 
        employees e
    JOIN 
        employee_hierarchy eh ON e.manager_id = eh.employee_id
)
SELECT 
    employee_id,
    CONCAT(REPEAT('    ', level), first_name, ' ', last_name) AS employee_name,
    position,
    level,
    path
FROM 
    employee_hierarchy
ORDER BY 
    path;

-- 3. Dynamic Pivot Table using SQL
-- Convert row data into a dynamic column-based report

-- For MySQL/MariaDB (using prepared statement approach)
-- This would need to be executed in a stored procedure or application code
-- that can execute dynamic SQL

-- Sample prepared statement (pseudocode):
/*
SET @sql = NULL;

-- Get the list of unique categories for columns
SELECT 
    GROUP_CONCAT(DISTINCT 
        CONCAT('SUM(CASE WHEN product_category = ''', 
               product_category, 
               ''' THEN sales_amount ELSE 0 END) AS `', 
               product_category, '`')
    ) INTO @sql
FROM 
    sales;

-- Construct the full pivot query
SET @sql = CONCAT('
    SELECT 
        DATE_FORMAT(sale_date, ''%Y-%m'') AS month,
        ', @sql, ',
        SUM(sales_amount) AS total_sales
    FROM 
        sales
    GROUP BY 
        DATE_FORMAT(sale_date, ''%Y-%m'')
    ORDER BY 
        month
');

-- Execute the dynamic query
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
*/

-- For PostgreSQL (using crosstab function from tablefunc extension)
-- First, enable the extension: CREATE EXTENSION IF NOT EXISTS tablefunc;

/*
SELECT * FROM crosstab(
    'SELECT 
        DATE_FORMAT(sale_date, ''%Y-%m'') AS month,
        product_category,
        SUM(sales_amount) AS category_sales
     FROM 
        sales
     GROUP BY 
        DATE_FORMAT(sale_date, ''%Y-%m''), 
        product_category
     ORDER BY 1, 2',
    'SELECT DISTINCT product_category FROM sales ORDER BY 1'
) AS ct (
    month text,
    "Electronics" numeric,
    "Clothing" numeric,
    "Food" numeric,
    "Home" numeric
);
*/

-- 4. Advanced Join Patterns with Multiple Tables
-- Complex reporting query joining multiple tables with different join types

SELECT 
    p.product_id,
    p.product_name,
    p.product_category,
    p.unit_price,
    COALESCE(SUM(oi.quantity), 0) AS units_sold,
    COALESCE(SUM(oi.quantity * oi.unit_price), 0) AS total_revenue,
    COUNT(DISTINCT o.customer_id) AS unique_customers,
    AVG(r.rating) AS avg_rating,
    COUNT(r.review_id) AS review_count,
    i.quantity_in_stock,
    CASE
        WHEN i.quantity_in_stock = 0 THEN 'Out of Stock'
        WHEN i.quantity_in_stock < 10 THEN 'Low Stock'
        WHEN i.quantity_in_stock < 50 THEN 'Medium Stock'
        ELSE 'Well Stocked'
    END AS inventory_status,
    COALESCE(
        NULLIF(SUM(oi.quantity), 0) / 
        NULLIF(DATEDIFF(MAX(o.order_date), MIN(o.order_date)), 0) * 30, 
        0
    ) AS monthly_sales_velocity
FROM 
    products p
LEFT JOIN 
    inventory i ON p.product_id = i.product_id
LEFT JOIN 
    order_items oi ON p.product_id = oi.product_id
LEFT JOIN 
    orders o ON oi.order_id = o.order_id
LEFT JOIN 
    reviews r ON p.product_id = r.product_id
WHERE 
    (o.order_date IS NULL OR o.order_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH))
    AND p.is_active = 1
GROUP BY 
    p.product_id,
    p.product_name,
    p.product_category,
    p.unit_price,
    i.quantity_in_stock
HAVING 
    units_sold > 0 OR i.quantity_in_stock > 0
ORDER BY 
    total_revenue DESC;

-- 5. Complex Upsert Pattern
-- Upsert (insert or update) pattern for synchronizing data

-- For MySQL (using ON DUPLICATE KEY UPDATE)
INSERT INTO product_price_history (
    product_id,
    price_date,
    unit_price,
    discount_percent,
    effective_price,
    modified_by
)
VALUES 
    (1001, CURRENT_DATE(), 29.99, 0.00, 29.99, 'price_sync'),
    (1002, CURRENT_DATE(), 49.99, 10.00, 44.99, 'price_sync'),
    (1003, CURRENT_DATE(), 19.99, 5.00, 18.99, 'price_sync')
ON DUPLICATE KEY UPDATE
    unit_price = VALUES(unit_price),
    discount_percent = VALUES(discount_percent),
    effective_price = VALUES(effective_price),
    modified_by = VALUES(modified_by),
    last_updated = CURRENT_TIMESTAMP();

-- For PostgreSQL (using ON CONFLICT)
/*
INSERT INTO product_price_history (
    product_id,
    price_date,
    unit_price,
    discount_percent,
    effective_price,
    modified_by
)
VALUES 
    (1001, CURRENT_DATE, 29.99, 0.00, 29.99, 'price_sync'),
    (1002, CURRENT_DATE, 49.99, 10.00, 44.99, 'price_sync'),
    (1003, CURRENT_DATE, 19.99, 5.00, 18.99, 'price_sync')
ON CONFLICT (product_id, price_date)
DO UPDATE SET
    unit_price = EXCLUDED.unit_price,
    discount_percent = EXCLUDED.discount_percent,
    effective_price = EXCLUDED.effective_price,
    modified_by = EXCLUDED.modified_by,
    last_updated = CURRENT_TIMESTAMP;
*/

-- 6. Temporal Query Patterns
-- Time-based analysis using date functions

-- Sales trend analysis with moving averages
WITH daily_sales AS (
    SELECT 
        DATE(order_date) AS sale_date,
        SUM(total_amount) AS daily_total
    FROM 
        orders
    WHERE 
        order_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY)
        AND order_status = 'completed'
    GROUP BY 
        DATE(order_date)
),
sales_with_averages AS (
    SELECT 
        sale_date,
        daily_total,
        AVG(daily_total) OVER (
            ORDER BY sale_date 
            ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        ) AS seven_day_average,
        AVG(daily_total) OVER (
            ORDER BY sale_date 
            ROWS BETWEEN 13 PRECEDING AND CURRENT ROW
        ) AS fourteen_day_average,
        AVG(daily_total) OVER (
            ORDER BY sale_date 
            ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
        ) AS thirty_day_average
    FROM 
        daily_sales
)
SELECT 
    sale_date,
    daily_total,
    seven_day_average,
    fourteen_day_average,
    thirty_day_average,
    CASE 
        WHEN seven_day_average > fourteen_day_average THEN 'Upward Trend'
        WHEN seven_day_average < fourteen_day_average THEN 'Downward Trend'
        ELSE 'Stable'
    END AS short_term_trend,
    CASE
        WHEN daily_total > seven_day_average THEN 'Above Recent Average'
        WHEN daily_total < seven_day_average THEN 'Below Recent Average'
        ELSE 'At Average'
    END AS daily_performance
FROM 
    sales_with_averages
ORDER BY 
    sale_date DESC;

-- 7. Full-Text Search with Relevance Ranking
-- Demonstrates full-text search capabilities

-- For MySQL
/*
SELECT 
    p.product_id,
    p.product_name,
    p.product_description,
    p.product_category,
    p.unit_price,
    MATCH(p.product_name, p.product_description) AGAINST ('organic natural vitamin' IN BOOLEAN MODE) AS relevance_score
FROM 
    products p
WHERE 
    MATCH(p.product_name, p.product_description) AGAINST ('organic natural vitamin' IN BOOLEAN MODE)
ORDER BY 
    relevance_score DESC
LIMIT 20;
*/

-- 8. Conditional Aggregation for Business Intelligence
-- Customer segmentation with conditional aggregation

SELECT 
    c.customer_id,
    c.first_name,
    c.last_name,
    c.email,
    COUNT(o.order_id) AS total_orders,
    SUM(CASE WHEN o.order_status = 'completed' THEN 1 ELSE 0 END) AS completed_orders,
    SUM(CASE WHEN o.order_status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_orders,
    SUM(CASE WHEN o.payment_method = 'credit_card' THEN o.total_amount ELSE 0 END) AS credit_card_sales,
    SUM(CASE WHEN o.payment_method = 'paypal' THEN o.total_amount ELSE 0 END) AS paypal_sales,
    SUM(CASE WHEN o.payment_method = 'bank_transfer' THEN o.total_amount ELSE 0 END) AS bank_transfer_sales,
    SUM(CASE 
        WHEN DAYOFWEEK(o.order_date) IN (1, 7) THEN o.total_amount 
        ELSE 0 
    END) AS weekend_sales,
    SUM(CASE 
        WHEN DAYOFWEEK(o.order_date) NOT IN (1, 7) THEN o.total_amount 
        ELSE 0 
    END) AS weekday_sales,
    SUM(CASE 
        WHEN HOUR(o.order_date) BETWEEN 9 AND 17 THEN o.total_amount 
        ELSE 0 
    END) AS business_hours_sales,
    SUM(CASE 
        WHEN HOUR(o.order_date) NOT BETWEEN 9 AND 17 THEN o.total_amount 
        ELSE 0 
    END) AS after_hours_sales,
    COUNT(DISTINCT DATE(o.order_date)) AS active_days
FROM 
    customers c
LEFT JOIN 
    orders o ON c.customer_id = o.customer_id
WHERE 
    o.order_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 YEAR)
GROUP BY 
    c.customer_id,
    c.first_name,
    c.last_name,
    c.email
HAVING 
    total_orders > 0
ORDER BY 
    total_orders DESC;

-- 9. Data Quality Assessment Query
-- Identifies potential data quality issues

SELECT 
    'Customers' AS table_name,
    'Missing Email' AS issue_type,
    COUNT(*) AS record_count
FROM 
    customers 
WHERE 
    email IS NULL OR TRIM(email) = ''

UNION ALL

SELECT 
    'Customers' AS table_name,
    'Invalid Email Format' AS issue_type,
    COUNT(*) AS record_count
FROM 
    customers 
WHERE 
    email NOT LIKE '%_@_%.__%'
    AND email IS NOT NULL

UNION ALL

SELECT 
    'Orders' AS table_name,
    'Negative Order Amount' AS issue_type,
    COUNT(*) AS record_count
FROM 
    orders 
WHERE 
    total_amount < 0

UNION ALL

SELECT 
    'Products' AS table_name,
    'Zero or Negative Price' AS issue_type,
    COUNT(*) AS record_count
FROM 
    products 
WHERE 
    unit_price <= 0

UNION ALL

SELECT 
    'Orders' AS table_name,
    'Future Order Date' AS issue_type,
    COUNT(*) AS record_count
FROM 
    orders 
WHERE 
    order_date > CURRENT_DATE()

UNION ALL

SELECT 
    'Order Items' AS table_name,
    'Quantity Mismatch' AS issue_type,
    COUNT(*) AS record_count
FROM 
    order_items oi
JOIN 
    orders o ON oi.order_id = o.order_id
WHERE 
    oi.quantity <= 0
    OR (oi.unit_price * oi.quantity) <> oi.line_total

ORDER BY 
    record_count DESC;

-- 10. Report on Data Retention and Performance Optimization
-- Identifies tables for archiving and optimization

SELECT 
    table_schema AS database_name,
    table_name,
    table_rows,
    ROUND((data_length + index_length) / 1024 / 1024, 2) AS size_mb,
    ROUND((data_length) / 1024 / 1024, 2) AS data_size_mb,
    ROUND((index_length) / 1024 / 1024, 2) AS index_size_mb,
    ROUND(index_length / CASE WHEN data_length = 0 THEN 1 ELSE data_length END * 100, 2) AS index_ratio_percent,
    CASE 
        WHEN table_name LIKE '%_archive' THEN 'Archive'
        WHEN table_name LIKE '%_log' THEN 'Log'
        WHEN table_name LIKE '%_history' THEN 'History'
        WHEN table_name LIKE '%_audit' THEN 'Audit'
        ELSE 'Operational'
    END AS table_type,
    (
        SELECT MAX(update_time)
        FROM information_schema.tables
        WHERE table_schema = information_schema.tables.table_schema
        AND table_name = information_schema.tables.table_name
    ) AS last_update,
    DATEDIFF(NOW(), (
        SELECT MAX(update_time)
        FROM information_schema.tables
        WHERE table_schema = information_schema.tables.table_schema
        AND table_name = information_schema.tables.table_name
    )) AS days_since_update
FROM 
    information_schema.tables
WHERE 
    table_schema = 'your_database_name'
    AND table_type = 'BASE TABLE'
ORDER BY
    size_mb DESC;

-- Note: Some of these queries may need adjustments based on your specific database engine
-- They are designed to work primarily with MySQL/MariaDB but concepts apply to other databases