class Configuration {
    static set(test) {
        const isTest = test === 'enabled';
        Configuration.keys = {
            azureWebJobsStorage: Configuration.getEnvironmentVariable('AzureWebJobsStorage'),
            azureContainerName: Configuration.getEnvironmentVariable('Azure.ContainerName'),
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
