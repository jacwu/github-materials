param containerAppsEnvName string 
param appName string 
param location string 
@secure()
param registryPassword string
param registryUsername string
param registryServer string
param httpPort int
param containerImage string 

resource caEnvironment 'Microsoft.App/managedEnvironments@2022-01-01-preview' existing = {
  name: containerAppsEnvName
}

resource containerApp 'Microsoft.App/containerApps@2022-03-01' ={
  name: appName
  location: location
  properties:{
    managedEnvironmentId: caEnvironment.id
    configuration: {
      secrets: [
        {
          name: 'registrypassword'
          value: registryPassword
        }
      ]
      registries: [
        {
          server: registryServer
          username: registryUsername
          passwordSecretRef: 'registrypassword'
        }
      ]
      ingress: {
        targetPort: httpPort
        external: true
      }
      dapr: {
        enabled: true
        appId: appName
        appProtocol: 'http'
        appPort: httpPort
      }
    }
    template: {
      containers: [
        {
          image: containerImage
          name: appName
        }
      ]
    }
  }
}
