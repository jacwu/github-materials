# This code is generated by GitHub Copilot (VS Code)
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time

class TestStudentRegistration:
    def __init__(self):
        self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
        self.wait = WebDriverWait(self.driver, 5)
        self.success_count = 0
        self.fail_count = 0

    def test_form_validation(self):
        try:
            # Navigate to the page
            self.driver.get("http://127.0.0.1:3000/scenarios/ui-automation/student_registration.html")

            # Wait for the form to load and fill in the fields
            student_id = self.wait.until(EC.presence_of_element_located((By.ID, "studentId")))
            student_id.send_keys("1")

            name = self.wait.until(EC.presence_of_element_located((By.ID, "name")))
            name.send_keys("W")

            # Skip gender selection as per requirements

            birthday = self.wait.until(EC.presence_of_element_located((By.ID, "birthday")))
            birthday.send_keys("2000-01-01")

            email = self.wait.until(EC.presence_of_element_located((By.ID, "email")))
            email.send_keys("e")

            phone = self.wait.until(EC.presence_of_element_located((By.ID, "phone")))
            phone.send_keys("1234")

            class_field = self.wait.until(EC.presence_of_element_located((By.ID, "class")))
            class_field.send_keys("9")

            # Submit the form
            submit_button = self.driver.find_element(By.CSS_SELECTOR, "#studentForm button[type='submit']")
            submit_button.click()

            # Wait for error messages to appear and verify their display property
            error_ids = ["studentIdError", "nameError", "genderError", 
                        "emailError", "phoneError", "classError"]
            
            time.sleep(1)  # Small delay to ensure errors are displayed

            for error_id in error_ids:
                error_element = self.driver.find_element(By.ID, error_id)
                display_style = error_element.value_of_css_property("display")
                try:
                    assert display_style in ["block", "inline-block"], f"Error message {error_id} is not displayed"
                    print(f"✓ {error_id} validation passed")
                    self.success_count += 1
                except AssertionError as e:
                    print(f"✗ {error_id} validation failed: {str(e)}")
                    self.fail_count += 1

        finally:
            print(f"\nTest Summary:")
            print(f"Successful assertions: {self.success_count}")
            print(f"Failed assertions: {self.fail_count}")
            self.driver.quit()

if __name__ == "__main__":
    test = TestStudentRegistration()
    test.test_form_validation()