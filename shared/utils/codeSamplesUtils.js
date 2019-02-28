const {
    getLanguageLabel,
    getCodeSampleLabel,
    getInnerItemLabel
} = require('./richTextLabels');

function insertLinkedCodeSamples(text, linkedItems) {
    const linkedItemsKeys = Object.keys(linkedItems);

    for (const key of linkedItemsKeys) {
        const linkedItem = linkedItems[key];

        if (linkedItem.system.type === 'code_sample') {
            const codeSampleIdentifier = getCodeSampleLabel(linkedItem.system.codename);
            const codeSampleContent = insertCodeSampleContent(linkedItem);

            text = text.replace(codeSampleIdentifier, codeSampleContent);
        }
    }
    return text;
}

function insertCodeSampleContent(codeSample) {
    if (codeSample.programmingLanguage.value.length === 1) {
        const language = codeSample.programmingLanguage.value[0].codename;
        const languageLabel = getLanguageLabel(language);

        return getInnerItemLabel(languageLabel + codeSample.code.value);
    } else {
        return getInnerItemLabel(codeSample.code.value);
    }
}

module.exports = insertLinkedCodeSamples;
