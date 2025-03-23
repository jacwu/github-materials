## Use Playwright to record page visit

# Use Playwright to access http://127.0.0.1:3000/scenarios/ui-automation/student_registration.html

# call tool playwright_evaluate execute javascript to get all the element's id and xpath
{
  "script": "Array.from(document.querySelectorAll('*[id]')).map(el => ({\n    id: el.id,\n    xpath: getXPath(el)\n}));\n\nfunction getXPath(element) {\n    if (element.id !== '')\n        return `//*[@id=\"${element.id}\"]`;\n    \n    if (element === document.body)\n        return '/html/body';\n\n    let ix = 0;\n    let siblings = element.parentNode.childNodes;\n\n    for (let i = 0; i < siblings.length; i++) {\n        let sibling = siblings[i];\n        if (sibling === element)\n            return getXPath(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';\n        if (sibling.nodeType === 1 && sibling.tagName === element.tagName)\n            ix++;\n    }\n}"
}

# Fill in the following information with Playwright tool:
Student ID: 1
Name: W
Gender: Leave no selection
Date of Birth: 2000-01-01
Email: e
Phone Number: 1234
Class: 9

# click submit button with Playwright tool

# After submitting the form, there should be error message for the following elements, record the id
Student ID
Name
Gender
Email
Phone Number
Class

## Write Selenium Python Script

# Based on above process, write a Selenium Python script to simulate same process (fill the field, click form submission button)

# verify that the target error divs's dispaly property has changed to 'blocked'

# The Selenium script needs to reference the following packages
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

# in selenium script, wait up to 5 seconds for element loaded before executing selection, sample code check below
presence_of_element_located((By.ID, "studentId"))

# in the end of selenium script, summarize how many assert success and fail
