const removeMarkdown = require('remove-markdown');

let itemRecords;

function createItemRecords(item, textToIndex) {
    const contentSplitByHeadings = textToIndex.split('<h2>');
    itemRecords = [];

    for (let i = 0; i < contentSplitByHeadings.length; i++) {
        const singleHeadingContent = contentSplitByHeadings[i];

        const hasHeading = singleHeadingContent.includes('</h2>');
        const heading = hasHeading ? extractHeading(singleHeadingContent) : '';

        if (singleHeadingContent.includes('<callout>')) {
            indexContentSplitByCallouts(singleHeadingContent, heading, item);
        } else {
            addItemRecord(removeMarkdown(singleHeadingContent).trim(), heading, item);
        }
    }

    return itemRecords;
}

function extractHeading(singleHeadingContent) {
    const headingIndex = singleHeadingContent.indexOf('</h2>');
    const heading = singleHeadingContent.substring(0, headingIndex);

    return heading.trim();
}

function indexContentSplitByCallouts(singleHeadingContent, heading, item) {
    const contentSplitByCallouts = singleHeadingContent.split('<callout>');

    for (let k = 0; k < contentSplitByCallouts.length; k++) {
        const content = contentSplitByCallouts[k];
        const calloutClosingTagIndex = content.indexOf('</callout>');
        const calloutContent = content.substring(0, calloutClosingTagIndex).trim();

        if (isNonEmpty(calloutContent)) {
            addItemRecord(calloutContent, heading, item);
        }

        // Handles any content left between an inserted callout and the next header (i. e. some paragraphs)
        const otherContent = content.substring(calloutClosingTagIndex);
        const otherContentWithoutMarkup = removeMarkdown(otherContent).trim();

        if (isNonEmpty(otherContentWithoutMarkup)) {
            addItemRecord(otherContentWithoutMarkup, heading, item);
        }
    }
}

function addItemRecord(content, heading, item) {
    const title = item.title && item.title.value;
    const id = item.system.id;
    const codename = item.system.codename;
    const order = itemRecords.length + 1;

    itemRecords.push({
        content,
        id,
        title,
        heading,
        codename,
        order,
        objectID: codename + '_' + order,
    });
}

function isNonEmpty(content) {
    return content !== null && content !== '';
}

module.exports = createItemRecords;
