import { ContentItem } from '@kentico/kontent-delivery';
import striptags = require('striptags');
import { CodeSamples } from '../models/code_samples';
import {
    getContentChunkLabel,
    getCodeSampleLabel,
    getPlatformLabel,
    getInnerItemLabel,
    ContentChunkHeadingMarkStart,
    ContentChunkHeadingMarkEnd
} from './richTextLabels';

export function resolveItemInRichText(item: ContentItem): string {
    switch (item.system.type) {
        case 'callout': {
            const content = striptags(item.content.value);
            return getInnerItemLabel(content, false);
        }
        case 'content_chunk':
            return resolveContentChunkItem(item);
        case 'code_sample':
            return getCodeSampleLabel(item.system.codename);
        case 'code_samples':
            return resolveCodeSamplesItem(item as CodeSamples);
        default:
            return '';
    }
}

function resolveContentChunkItem(item: ContentItem) {
    const labelledPlatforms = getPlatformLabel(item.platform.value);
    const contentWithResolvedHeadings = resolveContentChunkHeadings(item.content.value);

    return getContentChunkLabel(labelledPlatforms + contentWithResolvedHeadings);
}

function resolveContentChunkHeadings(content: string) {
    return content.replace(/<h2>/g, ContentChunkHeadingMarkStart).replace(/<\/h2>/g, ContentChunkHeadingMarkEnd);
}

function resolveCodeSamplesItem(item: CodeSamples) {
    let codeSamplesContent = '';

    item.codeSamples.value
        .map((m) => m.system.codename)
        .forEach((codeSampleCodename) => {
            codeSamplesContent += getCodeSampleLabel(codeSampleCodename);
        });

    return codeSamplesContent;
}
