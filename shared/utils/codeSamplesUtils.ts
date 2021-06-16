import { IContentItemsContainer } from '@kentico/kontent-delivery';
import { CodeSample } from '../models/code_sample';
import {
    CodeSampleHeadingMarkStart,
    CodeSampleHeadingMarkEnd,
    getPlatformLabel,
    getCodeSampleLabel,
    getInnerItemLabel
} from './richTextLabels';

export function insertLinkedCodeSamples(text: string, linkedItems: IContentItemsContainer) {
    const linkedItemsKeys = Object.keys(linkedItems);

    for (const key of linkedItemsKeys) {
        const linkedItem = linkedItems[key];

        if (linkedItem.system.type === 'code_sample') {
            const codeSampleIdentifier = getCodeSampleLabel(linkedItem.system.codename);
            const codeSampleContent = insertLabelledCodeSampleContent(linkedItem as CodeSample);

            text = text.replace(codeSampleIdentifier, codeSampleContent);
        }
    }
    return text;
}

function insertLabelledCodeSampleContent(codeSample: CodeSample) {
    const content = replaceHeadingTagsWithMarks(codeSample.code.value);

    if (codeSample.platform.value.length === 1) {
        const platform = codeSample.platform.value;
        const platformLabel = getPlatformLabel(platform);

        return getInnerItemLabel(platformLabel + content, true);
    } else {
        return getInnerItemLabel(content, true);
    }
}

export function replaceHeadingMarksWithTags(content: string) {
    const headingMarkStartRegex = new RegExp(CodeSampleHeadingMarkStart, 'g');
    const headingMarkEndRegex = new RegExp(CodeSampleHeadingMarkEnd, 'g');

    return content.replace(headingMarkStartRegex, '<h2>').replace(headingMarkEndRegex, '</h2>');
}

function replaceHeadingTagsWithMarks(content: string) {
    return content.replace(/<h2>/g, CodeSampleHeadingMarkStart).replace(/<\/h2>/g, CodeSampleHeadingMarkEnd);
}
