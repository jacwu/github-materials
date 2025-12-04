import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def update_customer_record(customer_id, full_name, email_address, phone_number, credit_card_number):
    """
    Updates the customer record in the database.
    """
    logging.info(f"Starting update for Customer ID: {customer_id}")
    
    logging.info(f"Updating details - Name: {full_name}, Email: {email_address}")
    logging.info(f"Contact Phone: {phone_number}")
    logging.info(f"Payment Info (CC): {credit_card_number}") 

    # Simulate database update logic
    # In a real application, this would interact with a DB
    print(f"Database successfully updated for customer {customer_id}")
    return True

if __name__ == "__main__":
    update_customer_record(
        customer_id="CUST-1001",
        full_name="Alice Smith",
        email_address="alice.smith@example.com",
        phone_number="+1-202-555-0123",
        credit_card_number="4532-1234-5678-9012"
    )
