const striptags = require('striptags');
const {
    getContentChunkLabel,
    getCodeSampleLabel,
    getPlatformLabel,
    getInnerItemLabel,
    ContentChunkHeadingMarkStart,
    ContentChunkHeadingMarkEnd,
} = require('./richTextLabels');

function resolveItemInRichText(item) {
    switch (item.system.type) {
        case 'callout': {
            const content = striptags(item.content.value);
            return getInnerItemLabel(content);
        }
        case 'content_chunk':
            return resolveContentChunkItem(item);
        case 'code_sample':
            return getCodeSampleLabel(item.system.codename);
        case 'code_samples':
            return resolveCodeSamplesItem(item);
        default:
            return '';
    }
}

function resolveContentChunkItem(item) {
    const labelledPlatforms = getPlatformLabel(item.platform.value);
    const contentWithResolvedHeadings = resolveContentChunkHeadings(item.content.value);

    return getContentChunkLabel(labelledPlatforms + contentWithResolvedHeadings);
}

function resolveContentChunkHeadings(content) {
    return content
        .replace(/<h2>/g, ContentChunkHeadingMarkStart)
        .replace(/<\/h2>/g, ContentChunkHeadingMarkEnd);
}

function resolveCodeSamplesItem(item) {
    let codeSamplesContent = '';

    item.codeSamples.value.map(m => m.system.codename).forEach(codeSampleCodename => {
        codeSamplesContent += getCodeSampleLabel(codeSampleCodename);
    });

    return codeSamplesContent;
}

module.exports = resolveItemInRichText;
