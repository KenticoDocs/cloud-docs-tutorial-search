const removeMarkdown = require('remove-markdown');

let indexableArticleChunks;

function createIndexableArticleChunks(article, textToIndex) {
    const contentSplitByHeadings = textToIndex.split('<h2>');
    indexableArticleChunks = [];

    for (let i = 0; i < contentSplitByHeadings.length; i++) {
        const singleHeadingContent = contentSplitByHeadings[i];

        const hasHeading = singleHeadingContent.includes('</h2>');
        const heading = hasHeading ? extractHeading(singleHeadingContent) : '';

        if (singleHeadingContent.includes('<callout>')) {
            indexContentSplitByCallouts(singleHeadingContent, heading, article);
        } else {
            addIndexableArticleChunk(removeMarkdown(singleHeadingContent), heading, article);
        }
    }

    return indexableArticleChunks;
}

function extractHeading(contentChunk) {
    const headingIndex = contentChunk.indexOf('</h2>');
    const heading = contentChunk.substring(0, headingIndex);

    return heading.trim();
}

function indexContentSplitByCallouts(singleHeadingContent, heading, article) {
    const contentSplitByCallouts = singleHeadingContent.split('<callout>');

    for (let k = 0; k < contentSplitByCallouts.length; k++) {
        const content = contentSplitByCallouts[k];
        const calloutClosingTagIndex = content.indexOf('</callout>');
        const calloutContent = content.substring(0, calloutClosingTagIndex).trim();

        if (isNonEmpty(calloutContent)) {
            addIndexableArticleChunk(calloutContent, heading, article);
        }

        // Handles any content left between an inserted callout and the next header (i. e. some paragraphs)
        const otherContent = content.substring(calloutClosingTagIndex).trim();
        const otherContentWithoutMarkup = removeMarkdown(otherContent);

        if (isNonEmpty(otherContentWithoutMarkup)) {
            addIndexableArticleChunk(otherContentWithoutMarkup, heading, article);
        }
    }
}

function addIndexableArticleChunk(content, heading, article) {
    const title = article.title && article.title.value;
    const id = article.system.id;
    const codename = article.system.codename;
    const order = indexableArticleChunks.length + 1;

    indexableArticleChunks.push({
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

module.exports = createIndexableArticleChunks;
