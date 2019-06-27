class Configuration {
    static set(test) {
        const isTest = test === 'enabled';
        Configuration.keys = {
            azureContainerName: Configuration.getEnvironmentVariable('Azure.ContainerName', isTest),
            azureStorageAccountName: Configuration.getEnvironmentVariable('Azure.StorageAccountName'),
            azureStorageKey: Configuration.getEnvironmentVariable('Azure.StorageKey'),
            kenticoProjectId: Configuration.getEnvironmentVariable('KC.ProjectId', isTest),
            securedApiKey: Configuration.getEnvironmentVariable('KC.SecuredApiKey', isTest),
            clearIndexUrl: Configuration.getClearIndexUrl(isTest),
        }
    }

    static getEnvironmentVariable(variableName, isTest) {
        return process.env[`${variableName}${isTest ? '.Test' : ''}`] || '';
    }

    static getClearIndexUrl(isTest) {
        const isTestQuery = isTest
                      ? '&isTest=enabled'
                      : '';

        return `${process.env['Azure.ClearIndexUrl']}${isTestQuery}&section=tutorials`;
    }
}

module.exports = Configuration;
