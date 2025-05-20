# Azure Blob File Manager Documentation

This document describes the `AzureBlobFileManager` class and its functionality in the `azure_file_manager.py` file.

## AzureBlobFileManager Class

`AzureBlobFileManager` is a utility class for managing Azure Blob storage, providing simple interfaces for uploading and downloading files.

### Initialization Method

```python
def __init__(self, connection_string: str, container_name: str)
```

**Parameters:**
- `connection_string`: Connection string for the Azure Storage account
- `container_name`: Blob container name

**Functionality:**
- Initializes the connection to Azure Blob storage
- Creates a client object for the specified container

### Upload File

```python
def upload_file(self, file_path: str, blob_name: str = None) -> bool
```

**Parameters:**
- `file_path`: Local file path to upload
- `blob_name`: (Optional) Name of the blob in storage, uses the original filename if not specified

**Returns:**
- `bool`: Whether the upload operation was successful

**Functionality:**
- Checks if the local file exists
- Uses the local filename if blob_name is not specified
- Creates a blob client and uploads the file
- Overwrites existing files with the same name
- Prints upload result information

### Download File

```python
def download_file(self, blob_name: str, download_path: str) -> bool
```

**Parameters:**
- `blob_name`: Name of the blob to download
- `download_path`: Local path to download the file to

**Returns:**
- `bool`: Whether the download operation was successful

**Functionality:**
- Gets the client for the specified blob
- Ensures the download directory exists
- Downloads the blob content and saves it to the specified path
- Handles exceptions such as resource not found
- Prints download result information

## Usage Example

```python
# Initialize AzureBlobFileManager
connection_string = "your_connection_string"
container_name = "your_container_name"
file_manager = AzureBlobFileManager(connection_string, container_name)

# Upload a file
file_manager.upload_file("local/path/to/file.txt", "remote_file_name.txt")

# Download a file
file_manager.download_file("remote_file_name.txt", "local/download/path/file.txt")
```

## Dependencies

This module depends on the following Azure SDK packages:
- `azure.storage.blob`
- `azure.core.exceptions`

As well as the `os` module from the Python standard library (for file path operations).
