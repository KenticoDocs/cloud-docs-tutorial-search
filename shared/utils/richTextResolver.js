const removeMarkdown = require('remove-markdown');

function resolveItemInRichText(item) {
    switch (item.system.type) {
        case 'callout':
            const content = removeMarkdown(item.content.value);
            return `<callout>${content}</callout>`;
        case 'content_chunk':
            return item.content.value;
        default:
            return '';
    }
}

module.exports = resolveItemInRichText;
