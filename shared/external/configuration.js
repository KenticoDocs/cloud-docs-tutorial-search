class Configuration {
    static set(isTest) {
        Configuration.keys = {
            azureContainerName: Configuration.getEnvironmentVariable('Azure.ContainerName', isTest),
            azureStorageAccountName: Configuration.getEnvironmentVariable('Azure.StorageAccountName'),
            azureStorageKey: Configuration.getEnvironmentVariable('Azure.StorageKey'),
            kenticoProjectId: Configuration.getEnvironmentVariable('KC.ProjectId', isTest),
            securedApiKey: Configuration.getEnvironmentVariable('KC.SecuredApiKey', isTest),
            clearIndexUrl: Configuration.getEnvironmentVariable('Azure.ClearIndexUrl', isTest),
        }
    }

    static getEnvironmentVariable(variableName, isTest) {
        return process.env[`${variableName}${isTest ? '.Test' : ''}`] || '';
    }
}

module.exports = Configuration;
