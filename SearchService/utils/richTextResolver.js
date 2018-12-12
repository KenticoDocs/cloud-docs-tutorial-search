function resolveItemInRichText(item) {
    if (item.system.type === 'callout') {
        return item.content.value;
    } else {
        return "";
    }
}

module.exports = resolveItemInRichText;
