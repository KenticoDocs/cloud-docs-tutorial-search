import { ElementModels } from '@kentico/kontent-delivery';

export const PlatformMarkStart = '#~platform#';
export const PlatformMarkEnd = '#platform~#';
export const InnerItemMarkStart = '#~inner_item#';
export const InnerItemMarkEnd = '#inner_item~#';
export const CodeSampleMarkStart = '#~code_sample#';
export const CodeSampleMarkEnd = '#code_sample~#';
export const CodeSampleHeadingMarkStart = '#~code_sample_heading#';
export const CodeSampleHeadingMarkEnd = '#code_sample_heading~#';
export const ContentChunkMarkStart = '#~content_chunk#';
export const ContentChunkMarkEnd = '#content_chunk~#';
export const ContentChunkHeadingMarkStart = '#~content_chunk_heading#';
export const ContentChunkHeadingMarkEnd = '#content_chunk_heading~#';
export const IsCodeSampleIdentifierMarkup = '#~isCodeSample~#';
export const AnchorTagMarkStart = '{#a';
export const AnchorTagMarkEnd = '#}';

export function getPlatformLabel(platform: ElementModels.TaxonomyTerm[]) {
    if (platform.length > 0) {
        const platformCodenames = platform.map((item) => item.codename);

        return PlatformMarkStart + platformCodenames.join() + PlatformMarkEnd;
    }

    return '';
}

export function getContentChunkLabel(content: string) {
    return ContentChunkMarkStart + content + ContentChunkMarkEnd;
}

export function getInnerItemLabel(content: string, isCodeSample: boolean) {
    return InnerItemMarkStart + (isCodeSample ? IsCodeSampleIdentifierMarkup : '') + content + InnerItemMarkEnd;
}

export function getCodeSampleLabel(codename: string) {
    return CodeSampleMarkStart + codename + CodeSampleMarkEnd;
}
