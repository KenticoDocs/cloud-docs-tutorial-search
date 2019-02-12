const removeMarkdown = require('remove-markdown');

function resolveItemInRichText(item) {
    if (item.system.type === 'callout') {
        const content = removeMarkdown(item.content.value);
        return `<callout>${content}</callout>`;
    } else {
        return '';
    }
}

module.exports = resolveItemInRichText;
