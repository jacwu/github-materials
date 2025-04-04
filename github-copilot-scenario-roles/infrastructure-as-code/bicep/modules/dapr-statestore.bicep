param storage_account_name string
param storage_container_name string
param containerAppsEnvName string

resource caEnvironment  'Microsoft.App/managedEnvironments@2022-03-01' existing = {
  name: containerAppsEnvName
}

resource daprComponent 'Microsoft.App/managedEnvironments/daprComponents@2022-01-01-preview' = {
  parent: caEnvironment
  name: 'statestore'
  properties: {
    componentType: 'state.azure.blobstorage'
    version: 'v1'
    ignoreErrors: false
    initTimeout: '5s'
    secrets: [
      {
        name: 'storageaccountkey'
        value: listKeys(resourceId('Microsoft.Storage/storageAccounts/', storage_account_name), '2021-09-01').keys[0].value
      }
    ]
    metadata: [
      {
        name: 'accountName'
        value: storage_account_name
      }
      {
        name: 'containerName'
        value: storage_container_name
      }
      {
        name: 'accountKey'
        secretRef: 'storageaccountkey'
      }
    ]
    scopes: ['album-api']
  }
}
