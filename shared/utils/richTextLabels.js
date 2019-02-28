function getLanguageLabel(language) {
    return `|~language|${language}|language~|`;
}

function getInnerItemLabel(content) {
    return `|~innerItem|${content}|innerItem~|`;
}

function getCodeSampleLabel(codename) {
    return `|~code_sample|${codename}|code_sample~|`;
}

function getInstructionsLabel(codename) {
    return `|~instructions|${codename}|instructions~|`;
}

module.exports = {
    getLanguageLabel,
    getInnerItemLabel,
    getCodeSampleLabel,
    getInstructionsLabel
};
