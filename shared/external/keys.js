const kenticoProjectId = process.env["KC.ProjectId"];

const searchAppId = process.env["Search.AppId"];
const adminApiKey = process.env["Search.ApiKey"];
const index = process.env["Search.IndexName"];

module.exports = {
    kenticoProjectId,
    searchAppId,
    adminApiKey,
    index,
};
