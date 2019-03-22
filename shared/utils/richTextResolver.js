const removeMarkdown = require('remove-markdown');
const {
    getInnerItemLabel,
    getCodeSampleLabel,
} = require('./richTextLabels');

function resolveItemInRichText(item) {
    switch (item.system.type) {
        case 'callout':
            const content = removeMarkdown(item.content.value);
            return getInnerItemLabel(content);
        case 'content_chunk':
            return item.content.value;
        case 'code_sample':
            return getCodeSampleLabel(item.system.codename);
        case 'code_samples':
            return resolveCodeSamplesItem(item);
        default:
            return '';
    }
}

function resolveCodeSamplesItem(item) {
    let codeSamplesContent = '';

    item.elements.code_samples.value.forEach(codeSampleCodename => {
        codeSamplesContent += getCodeSampleLabel(codeSampleCodename);
    });

    return codeSamplesContent;
}

module.exports = resolveItemInRichText;
