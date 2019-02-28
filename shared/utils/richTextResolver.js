const removeMarkdown = require('remove-markdown');
const {
    getInnerItemLabel,
    getCodeSampleLabel,
    getInstructionsLabel
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
        case 'content_switcher':
            return resolveContentSwitcherItem(item);
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

function resolveContentSwitcherItem(item) {
    let contentSwitcherContent = '';

    item.children.forEach(linkedItem => {
        if (linkedItem.system.type === 'instructions') {
            contentSwitcherContent += getInstructionsLabel(linkedItem.system.codename);
        }
    });

    return contentSwitcherContent;
}

module.exports = resolveItemInRichText;
