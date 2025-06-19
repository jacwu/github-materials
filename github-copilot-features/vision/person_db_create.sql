-- 此代码由 GitHub Copilot (VS Code) 生成
-- 基于ER关系图创建的MSSQL数据库脚本
-- 创建日期: 2025年6月19日

-- 启用ANSI NULL默认值
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- 创建数据库
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'PersonDB')
BEGIN
    CREATE DATABASE PersonDB;
END
GO

USE PersonDB;
GO

-- 创建CountryRegion表
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CountryRegion]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[CountryRegion](
        [CountryRegionCode] [nvarchar](10) PRIMARY KEY NOT NULL,
        [Name] [nvarchar](100) NOT NULL,
        [rowguid] [uniqueidentifier] DEFAULT NEWID(),
        [ModifiedDate] [datetime] DEFAULT GETDATE()
    )
END
GO

-- 创建StateProvince表
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[StateProvince]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[StateProvince](
        [StateProvinceID] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
        [StateProvinceCode] [nvarchar](10) NOT NULL,
        [CountryRegionCode] [nvarchar](10) NOT NULL,
        [IsOnlyStateProvinceFlag] [bit] NOT NULL DEFAULT(0),
        [Name] [nvarchar](100) NOT NULL,
        [TerritoryID] [int] NULL,
        [rowguid] [uniqueidentifier] DEFAULT NEWID(),
        [ModifiedDate] [datetime] DEFAULT GETDATE(),
        CONSTRAINT [FK_StateProvince_CountryRegion] FOREIGN KEY([CountryRegionCode])
            REFERENCES [dbo].[CountryRegion] ([CountryRegionCode])
    )
END
GO

-- 创建AddressType表
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[AddressType]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[AddressType](
        [AddressTypeID] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
        [Name] [nvarchar](100) NOT NULL,
        [rowguid] [uniqueidentifier] DEFAULT NEWID(),
        [ModifiedDate] [datetime] DEFAULT GETDATE()
    )
END
GO

-- 创建ContactType表
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ContactType]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[ContactType](
        [ContactTypeID] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
        [Name] [nvarchar](100) NOT NULL,
        [rowguid] [uniqueidentifier] DEFAULT NEWID(),
        [ModifiedDate] [datetime] DEFAULT GETDATE()
    )
END
GO

-- 创建PhoneNumberType表
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[PhoneNumberType]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[PhoneNumberType](
        [PhoneNumberTypeID] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
        [Name] [nvarchar](100) NOT NULL,
        [ModifiedDate] [datetime] DEFAULT GETDATE()
    )
END
GO

-- 创建BusinessEntity表
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[BusinessEntity]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[BusinessEntity](
        [BusinessEntityID] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
        [rowguid] [uniqueidentifier] DEFAULT NEWID(),
        [ModifiedDate] [datetime] DEFAULT GETDATE()
    )
END
GO

-- 创建Address表
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Address]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Address](
        [AddressID] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
        [AddressLine1] [nvarchar](255) NOT NULL,
        [AddressLine2] [nvarchar](255) NULL,
        [City] [nvarchar](100) NOT NULL,
        [StateProvinceID] [int] NOT NULL,
        [PostalCode] [nvarchar](20) NOT NULL,
        [SpatialLocation] [geography] NULL,
        [rowguid] [uniqueidentifier] DEFAULT NEWID(),
        [ModifiedDate] [datetime] DEFAULT GETDATE(),
        CONSTRAINT [FK_Address_StateProvince] FOREIGN KEY([StateProvinceID])
            REFERENCES [dbo].[StateProvince] ([StateProvinceID])
    )
END
GO

-- 创建Person表
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Person]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Person](
        [BusinessEntityID] [int] PRIMARY KEY NOT NULL,
        [PersonType] [nchar](2) NOT NULL,
        [NameStyle] [bit] NOT NULL DEFAULT(0),
        [Title] [nvarchar](50) NULL,
        [FirstName] [nvarchar](100) NOT NULL,
        [MiddleName] [nvarchar](100) NULL,
        [LastName] [nvarchar](100) NOT NULL,
        [Suffix] [nvarchar](30) NULL,
        [EmailPromotion] [int] NOT NULL DEFAULT(0),
        [AdditionalContactInfo] [xml] NULL,
        [Demographics] [xml] NULL,
        [rowguid] [uniqueidentifier] DEFAULT NEWID(),
        [ModifiedDate] [datetime] DEFAULT GETDATE(),
        CONSTRAINT [FK_Person_BusinessEntity] FOREIGN KEY([BusinessEntityID])
            REFERENCES [dbo].[BusinessEntity] ([BusinessEntityID])
    )
END
GO

-- 创建EmailAddress表
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[EmailAddress]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[EmailAddress](
        [BusinessEntityID] [int] NOT NULL,
        [EmailAddressID] [int] IDENTITY(1,1) NOT NULL,
        [EmailAddress] [nvarchar](255) NULL,
        [rowguid] [uniqueidentifier] DEFAULT NEWID(),
        [ModifiedDate] [datetime] DEFAULT GETDATE(),
        CONSTRAINT [PK_EmailAddress] PRIMARY KEY CLUSTERED 
        (
            [BusinessEntityID] ASC,
            [EmailAddressID] ASC
        ),
        CONSTRAINT [FK_EmailAddress_Person] FOREIGN KEY([BusinessEntityID])
            REFERENCES [dbo].[Person] ([BusinessEntityID])
    )
END
GO

-- 创建Password表
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Password]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Password](
        [BusinessEntityID] [int] PRIMARY KEY NOT NULL,
        [PasswordHash] [nvarchar](255) NOT NULL,
        [PasswordSalt] [nvarchar](50) NOT NULL,
        [rowguid] [uniqueidentifier] DEFAULT NEWID(),
        [ModifiedDate] [datetime] DEFAULT GETDATE(),
        CONSTRAINT [FK_Password_Person] FOREIGN KEY([BusinessEntityID])
            REFERENCES [dbo].[Person] ([BusinessEntityID])
    )
END
GO

-- 创建PersonPhone表
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[PersonPhone]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[PersonPhone](
        [BusinessEntityID] [int] NOT NULL,
        [PhoneNumber] [nvarchar](50) NOT NULL,
        [PhoneNumberTypeID] [int] NOT NULL,
        [ModifiedDate] [datetime] DEFAULT GETDATE(),
        CONSTRAINT [PK_PersonPhone] PRIMARY KEY CLUSTERED 
        (
            [BusinessEntityID] ASC,
            [PhoneNumber] ASC,
            [PhoneNumberTypeID] ASC
        ),
        CONSTRAINT [FK_PersonPhone_Person] FOREIGN KEY([BusinessEntityID])
            REFERENCES [dbo].[Person] ([BusinessEntityID]),
        CONSTRAINT [FK_PersonPhone_PhoneNumberType] FOREIGN KEY([PhoneNumberTypeID])
            REFERENCES [dbo].[PhoneNumberType] ([PhoneNumberTypeID])
    )
END
GO

-- 创建BusinessEntityAddress表
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[BusinessEntityAddress]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[BusinessEntityAddress](
        [BusinessEntityID] [int] NOT NULL,
        [AddressID] [int] NOT NULL,
        [AddressTypeID] [int] NOT NULL,
        [rowguid] [uniqueidentifier] DEFAULT NEWID(),
        [ModifiedDate] [datetime] DEFAULT GETDATE(),
        CONSTRAINT [PK_BusinessEntityAddress] PRIMARY KEY CLUSTERED 
        (
            [BusinessEntityID] ASC,
            [AddressID] ASC,
            [AddressTypeID] ASC
        ),
        CONSTRAINT [FK_BusinessEntityAddress_Address] FOREIGN KEY([AddressID])
            REFERENCES [dbo].[Address] ([AddressID]),
        CONSTRAINT [FK_BusinessEntityAddress_AddressType] FOREIGN KEY([AddressTypeID])
            REFERENCES [dbo].[AddressType] ([AddressTypeID]),
        CONSTRAINT [FK_BusinessEntityAddress_BusinessEntity] FOREIGN KEY([BusinessEntityID])
            REFERENCES [dbo].[BusinessEntity] ([BusinessEntityID])
    )
END
GO

-- 创建BusinessEntityContact表
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[BusinessEntityContact]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[BusinessEntityContact](
        [BusinessEntityID] [int] NOT NULL,
        [PersonID] [int] NOT NULL,
        [ContactTypeID] [int] NOT NULL,
        [rowguid] [uniqueidentifier] DEFAULT NEWID(),
        [ModifiedDate] [datetime] DEFAULT GETDATE(),
        CONSTRAINT [PK_BusinessEntityContact] PRIMARY KEY CLUSTERED 
        (
            [BusinessEntityID] ASC,
            [PersonID] ASC,
            [ContactTypeID] ASC
        ),
        CONSTRAINT [FK_BusinessEntityContact_BusinessEntity] FOREIGN KEY([BusinessEntityID])
            REFERENCES [dbo].[BusinessEntity] ([BusinessEntityID]),
        CONSTRAINT [FK_BusinessEntityContact_ContactType] FOREIGN KEY([ContactTypeID])
            REFERENCES [dbo].[ContactType] ([ContactTypeID]),
        CONSTRAINT [FK_BusinessEntityContact_Person] FOREIGN KEY([PersonID])
            REFERENCES [dbo].[Person] ([BusinessEntityID])
    )
END
GO

-- 创建索引提升性能
CREATE INDEX [IX_StateProvince_CountryRegionCode] ON [dbo].[StateProvince]([CountryRegionCode]);
CREATE INDEX [IX_Address_StateProvinceID] ON [dbo].[Address]([StateProvinceID]);
CREATE INDEX [IX_Person_LastName_FirstName_MiddleName] ON [dbo].[Person]([LastName], [FirstName], [MiddleName]);
CREATE INDEX [IX_EmailAddress_EmailAddress] ON [dbo].[EmailAddress]([EmailAddress]);
CREATE INDEX [IX_PersonPhone_PhoneNumber] ON [dbo].[PersonPhone]([PhoneNumber]);
GO

PRINT '所有表已成功创建!'
GO
