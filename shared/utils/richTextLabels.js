const PlatformMarkStart = '#~platform#';
const PlatformMarkEnd = '#platform~#';
const InnerItemMarkStart = '#~inner_item#';
const InnerItemMarkEnd = '#inner_item~#';
const CodeSampleMarkStart = '#~code_sample#';
const CodeSampleMarkEnd = '#code_sample~#';

function getPlatformLabel(platform) {
    return PlatformMarkStart + platform + PlatformMarkEnd;
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
    PlatformMarkStart,
    PlatformMarkEnd,
    InnerItemMarkStart,
    InnerItemMarkEnd,
    CodeSampleMarkStart,
    CodeSampleMarkEnd,
};
