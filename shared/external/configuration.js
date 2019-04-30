const keys = {
    kenticoProjectId: '',
    securedApiKey: '',
    searchAppId: '',
    adminApiKey: '',
    index: '',
};

const getEnvironmentVariable = (variableName, isTest) =>
    process.env[`${variableName}${isTest ? '.Test' : ''}`];

function setupConfiguration(test) {
    const isTest = test === 'enabled';

    keys.kenticoProjectId = getEnvironmentVariable('KC.ProjectId', isTest);
    keys.securedApiKey = getEnvironmentVariable('KC.SecuredApiKey', isTest);
    keys.searchAppId = getEnvironmentVariable('Search.AppId', isTest);
    keys.adminApiKey = getEnvironmentVariable('Search.ApiKey', isTest);
    keys.index = getEnvironmentVariable('Search.IndexName', isTest);
}

module.exports = {
    setupConfiguration,
    keys,
};
