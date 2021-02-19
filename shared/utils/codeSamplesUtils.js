const {
    CodeSampleHeadingMarkStart,
    CodeSampleHeadingMarkEnd,
    getPlatformLabel,
    getCodeSampleLabel,
    getInnerItemLabel,
} = require('./richTextLabels');

function insertLinkedCodeSamples(text, linkedItems) {
    const linkedItemsKeys = Object.keys(linkedItems);

    for (const key of linkedItemsKeys) {
        const linkedItem = linkedItems[key];

        if (linkedItem.system.type === 'code_sample') {
            const codeSampleIdentifier = getCodeSampleLabel(linkedItem.system.codename);
            const codeSampleContent = insertLabelledCodeSampleContent(linkedItem);

            text = text.replace(codeSampleIdentifier, codeSampleContent);
        }
    }
    return text;
}

function insertLabelledCodeSampleContent(codeSample) {
    const content = replaceHeadingTagsWithMarks(codeSample.code.value);

    if (codeSample.platform.value.length === 1) {
        const platform = codeSample.platform.value;
        const platformLabel = getPlatformLabel(platform);

        return getInnerItemLabel(platformLabel + content, true);
    } else {
        return getInnerItemLabel(content, true);
    }
}

function replaceHeadingTagsWithMarks(content) {
    return content
        .replace(/<h2>/g, CodeSampleHeadingMarkStart)
        .replace(/<\/h2>/g, CodeSampleHeadingMarkEnd);
}

function replaceHeadingMarksWithTags(content) {
    const headingMarkStartRegex = new RegExp(CodeSampleHeadingMarkStart, 'g');
    const headingMarkEndRegex = new RegExp(CodeSampleHeadingMarkEnd, 'g');

    return content
        .replace(headingMarkStartRegex, '<h2>')
        .replace(headingMarkEndRegex, '</h2>');
}

module.exports = {
    insertLinkedCodeSamples,
    replaceHeadingMarksWithTags,
};
