from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
from azure.core.exceptions import ResourceNotFoundError
import os

class AzureBlobFileManager:
    def __init__(self, connection_string: str, container_name: str):
        self.blob_service_client = BlobServiceClient.from_connection_string(connection_string)
        self.container_name = container_name
        self.container_client = self.blob_service_client.get_container_client(container_name)

    def upload_file(self, file_path: str, blob_name: str = None) -> bool:
        try:
            if not os.path.exists(file_path):
                print(f"Error: File {file_path} does not exist")
                return False

            # If blob_name is not specified, use the original file name
            if blob_name is None:
                blob_name = os.path.basename(file_path)

            # Get blob client
            blob_client = self.container_client.get_blob_client(blob_name)

            # Upload file
            with open(file_path, "rb") as data:
                blob_client.upload_blob(data, overwrite=True)
            
            print(f"File {file_path} has been successfully uploaded to {blob_name}")
            return True

        except Exception as e:
            print(f"Error occurred while uploading file: {str(e)}")
            return False

    def download_file(self, blob_name: str, download_path: str) -> bool:
        try:
            # Get blob client
            blob_client = self.container_client.get_blob_client(blob_name)

            # Ensure download directory exists
            os.makedirs(os.path.dirname(download_path), exist_ok=True)

            # Download file
            with open(download_path, "wb") as download_file:
                download_file.write(blob_client.download_blob().readall())

            print(f"File {blob_name} has been successfully downloaded to {download_path}")
            return True

        except ResourceNotFoundError:
            print(f"Error: Blob {blob_name} does not exist")
            return False
        except Exception as e:
            print(f"Error occurred while downloading file: {str(e)}")
            return False
