# Azure Blob 文件管理器文档

本文档描述了 `azure_file_manager.py` 文件中的 `AzureBlobFileManager` 类及其功能。

## AzureBlobFileManager 类

`AzureBlobFileManager` 是一个用于管理 Azure Blob 存储的工具类，提供简单的接口来上传和下载文件。

### 初始化方法

```python
def __init__(self, connection_string: str, container_name: str)
```

**参数:**
- `connection_string`: Azure Storage 账户的连接字符串
- `container_name`: Blob 容器名称

**功能:**
- 初始化与 Azure Blob 存储的连接
- 创建指定容器的客户端对象

### 上传文件

```python
def upload_file(self, file_path: str, blob_name: str = None) -> bool
```

**参数:**
- `file_path`: 要上传的本地文件路径
- `blob_name`: (可选) Blob 在存储中的名称，如未指定则使用原始文件名

**返回:**
- `bool`: 上传操作是否成功

**功能:**
- 检查本地文件是否存在
- 如果未指定 blob_name，则使用本地文件名
- 创建 blob 客户端并上传文件
- 覆盖已存在的同名文件
- 打印上传结果信息

### 下载文件

```python
def download_file(self, blob_name: str, download_path: str) -> bool
```

**参数:**
- `blob_name`: 要下载的 Blob 名称
- `download_path`: 文件下载到本地的路径

**返回:**
- `bool`: 下载操作是否成功

**功能:**
- 获取指定 blob 的客户端
- 确保下载目录存在
- 下载 blob 内容并保存到指定路径
- 处理资源不存在等异常
- 打印下载结果信息

## 使用示例

```python
# 初始化 AzureBlobFileManager
connection_string = "your_connection_string"
container_name = "your_container_name"
file_manager = AzureBlobFileManager(connection_string, container_name)

# 上传文件
file_manager.upload_file("local/path/to/file.txt", "remote_file_name.txt")

# 下载文件
file_manager.download_file("remote_file_name.txt", "local/download/path/file.txt")
```

## 依赖项

该模块依赖于以下 Azure SDK 包：
- `azure.storage.blob`
- `azure.core.exceptions`

以及 Python 标准库中的 `os` 模块（用于文件路径操作）。
