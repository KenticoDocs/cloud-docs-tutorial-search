const PlatformMarkStart = '#~platform#';
const PlatformMarkEnd = '#platform~#';
const InnerItemMarkStart = '#~inner_item#';
const InnerItemMarkEnd = '#inner_item~#';
const CodeSampleMarkStart = '#~code_sample#';
const CodeSampleMarkEnd = '#code_sample~#';
const CodeSampleHeadingMarkStart = '#~code_sample_heading#';
const CodeSampleHeadingMarkEnd = '#code_sample_heading~#';
const ContentChunkMarkStart = '#~content_chunk#';
const ContentChunkMarkEnd = '#content_chunk~#';
const ContentChunkHeadingMarkStart = '#~content_chunk_heading#';
const ContentChunkHeadingMarkEnd = '#content_chunk_heading~#';
const IsCodeSampleIdentifierMarkup = '#~isCodeSample~#';

function getPlatformLabel(platform) {
    if (platform.length > 0) {
        const platformCodenames = platform.map(item => item.codename);

        return PlatformMarkStart + platformCodenames.join() + PlatformMarkEnd;
    }

    return '';
}

function getContentChunkLabel(content) {
    return ContentChunkMarkStart + content + ContentChunkMarkEnd;
}

function getInnerItemLabel(content, isCodeSample) {
    return InnerItemMarkStart + (isCodeSample ? IsCodeSampleIdentifierMarkup : '') + content + InnerItemMarkEnd;
}

function getCodeSampleLabel(codename) {
    return CodeSampleMarkStart + codename + CodeSampleMarkEnd;
}

module.exports = {
    getPlatformLabel,
    getInnerItemLabel,
    getCodeSampleLabel,
    getContentChunkLabel,
    PlatformMarkStart,
    PlatformMarkEnd,
    InnerItemMarkStart,
    InnerItemMarkEnd,
    CodeSampleMarkStart,
    CodeSampleMarkEnd,
    CodeSampleHeadingMarkStart,
    CodeSampleHeadingMarkEnd,
    ContentChunkMarkStart,
    ContentChunkMarkEnd,
    ContentChunkHeadingMarkStart,
    ContentChunkHeadingMarkEnd,
    IsCodeSampleIdentifierMarkup
};
