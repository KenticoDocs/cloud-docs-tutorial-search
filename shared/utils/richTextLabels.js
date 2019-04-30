const PlatformMarkStart = '#~platform#';
const PlatformMarkEnd = '#platform~#';
const InnerItemMarkStart = '#~inner_item#';
const InnerItemMarkEnd = '#inner_item~#';
const CodeSampleMarkStart = '#~code_sample#';
const CodeSampleMarkEnd = '#code_sample~#';
const ContentChunkMarkStart = '#~content_chunk#';
const ContentChunkMarkEnd = '#content_chunk~#';
const ContentChunkHeadingMarkStart = '#~content_chunk_heading#';
const ContentChunkHeadingMarkEnd = '#content_chunk_heading~#';

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

function getInnerItemLabel(content) {
    return InnerItemMarkStart + content + InnerItemMarkEnd;
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
    ContentChunkMarkStart,
    ContentChunkMarkEnd,
    ContentChunkHeadingMarkStart,
    ContentChunkHeadingMarkEnd,
};
