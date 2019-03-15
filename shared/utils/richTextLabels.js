const LanguageMarkStart = '#~language#';
const LanguageMarkEnd = '#language~#';
const InnerItemMarkStart = '#~inner_item#';
const InnerItemMarkEnd = '#inner_item~#';
const CodeSampleMarkStart = '#~code_sample#';
const CodeSampleMarkEnd = '#code_sample~#';
const InstructionsMarkStart = '#~instructions#';
const InstructionsMarkEnd = '#instructions~#';

function getLanguageLabel(language) {
    return LanguageMarkStart + language + LanguageMarkEnd;
}

function getInnerItemLabel(content) {
    return InnerItemMarkStart + content + InnerItemMarkEnd;
}

function getCodeSampleLabel(codename) {
    return CodeSampleMarkStart + codename + CodeSampleMarkEnd;
}

function getInstructionsLabel(codename) {
    return InstructionsMarkStart + codename + InstructionsMarkEnd;
}

module.exports = {
    getLanguageLabel,
    getInnerItemLabel,
    getCodeSampleLabel,
    getInstructionsLabel,
    LanguageMarkStart,
    LanguageMarkEnd,
    InnerItemMarkStart,
    InnerItemMarkEnd,
    CodeSampleMarkStart,
    CodeSampleMarkEnd,
    InstructionsMarkStart,
    InstructionsMarkEnd,
};
