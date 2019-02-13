const keys = {
    kenticoProjectId: '',
    securedApiKey: '',
    searchAppId: '',
    adminApiKey: '',
    index: ''
};

function setupConfiguration(isTestEvent) {
    const isTest = isTestEvent === 'true';

    keys.kenticoProjectId = getEnvironmentVariable('KC.ProjectId', isTest);
    keys.securedApiKey = getEnvironmentVariable('KC.SecuredApiKey', isTest);
    keys.searchAppId = getEnvironmentVariable('Search.AppId', isTest);
    keys.adminApiKey = getEnvironmentVariable('Search.ApiKey', isTest);
    keys.index = getEnvironmentVariable('Search.IndexName', isTest);
}

const getEnvironmentVariable = (variableName, isTest) =>
    process.env[`${variableName}${isTest ? '.Test' : ''}`];

module.exports = {
    setupConfiguration,
    keys
};
