const kenticoProjectId = process.env["DOCS_PROJECT_ID"];

const searchAppId = process.env["SEARCH_APP_ID"];
const adminApiKey = process.env["SEARCH_ADMIN_API_KEY"];
const index = process.env["SEARCH_INDEX"];

module.exports = {
    kenticoProjectId,
    searchAppId,
    adminApiKey,
    index,
};
