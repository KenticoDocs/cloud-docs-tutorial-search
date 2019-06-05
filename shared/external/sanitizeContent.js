const axios = require('axios');
const { keys } = require('./configuration');

async function sanitizeContent(content) {
    const response = await axios.post(
        keys.sanitizeContentEndpoint,
        {
            content,
        });

    return response.data;
}

module.exports = sanitizeContent;
