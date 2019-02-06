let kenticoProjectId;
let searchAppId;
let adminApiKey;
let index;

function SetupConfiguration(isTestEvent) {
    kenticoProjectId = isTestEvent ? process.env["KC.ProjectId.Test"] : process.env["KC.ProjectId"];
    searchAppId = isTestEvent ? process.env["Search.AppId.Test"]: process.env["Search.AppId"];
    adminApiKey = isTestEvent ? process.env["Search.ApiKey.Test"] : process.env["Search.ApiKey"];
    index = isTestEvent ? process.env["Search.IndexName.Test"] : process.env["Search.IndexName"];
}

module.exports = {
    SetupConfiguration,
    kenticoProjectId,
    searchAppId,
    adminApiKey,
    index,
};
