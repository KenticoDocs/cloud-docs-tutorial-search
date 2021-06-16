import { replaceHeadingMarksWithTags } from './codeSamplesUtils';
import striptags = require('striptags');
import {
    PlatformMarkStart,
    PlatformMarkEnd,
    InnerItemMarkStart,
    InnerItemMarkEnd,
    ContentChunkMarkStart,
    ContentChunkMarkEnd,
    ContentChunkHeadingMarkStart,
    ContentChunkHeadingMarkEnd,
    IsCodeSampleIdentifierMarkup
} from './richTextLabels';
import {
    TERM_DEFINITION_CONTENT_TYPE,
    RELEASE_NOTE_CONTENT_TYPE,
    TRAINING_COURSE_CONTENT_TYPE
} from '../external/constants';
import { ContentItem, Elements } from '@kentico/kontent-delivery';

export function getItemRecordsCreator() {
    return new ItemRecordsCreator();
}

export interface IItemRecord {
    content: string;
    id: string;
    title: string;
    heading: string;
    codename: string;
    order: number;
    objectID: string;
    platforms: string[];
    section: string;
    isCodeSample: boolean;
}

export class ItemRecordsCreator {
    public itemRecords: IItemRecord[] = [];

    constructor() {
        this.itemRecords = [];
    }

    createItemRecords(item: ContentItem, textToIndex: string): IItemRecord[] {
        this.itemRecords = [];

        if (item.system.type === TRAINING_COURSE_CONTENT_TYPE) {
            this.indexTrainingContent(textToIndex, item);
        } else {
            const contentSplitByHeadings = textToIndex.split('<h2>');

            for (const singleHeadingContent of contentSplitByHeadings) {
                const { heading, content } = this.splitHeadingAndContent(singleHeadingContent, '</h2>');

                if (content.includes(ContentChunkMarkStart)) {
                    this.indexContentSplitByContentChunks(content, heading, item);
                } else {
                    this.indexLeftoverContent(content, heading, item);
                }
            }
        }

        return this.itemRecords;
    }

    splitHeadingAndContent(content: string, headingMarkEnd: string) {
        const contentParts = content.split(headingMarkEnd);

        return contentParts.length > 1
            ? {
                  heading: striptags(contentParts[0]).trim(),
                  content: contentParts[1].trim()
              }
            : {
                  heading: '',
                  content: contentParts[0].trim()
              };
    }

    indexContentSplitByContentChunks(content: string, heading: string, item: ContentItem) {
        const contentSplitByContentChunks = content.split(ContentChunkMarkStart);
        let lastContentChunkHeading = heading;

        for (const singleContentChunkContent of contentSplitByContentChunks) {
            lastContentChunkHeading = this.resolveAndIndexContentChunkItem(
                singleContentChunkContent,
                item,
                lastContentChunkHeading
            );

            const contentChunkClosingTagIndex = singleContentChunkContent.indexOf(ContentChunkMarkEnd);
            const leftoverContent = this.retrieveLeftoverContent(
                singleContentChunkContent,
                contentChunkClosingTagIndex,
                ContentChunkMarkEnd
            );

            const leftoverContentHeading = this.getCurrentHeading(lastContentChunkHeading, heading);
            this.indexLeftoverContent(leftoverContent, leftoverContentHeading, item);
        }
    }

    retrieveItemContent(content: string, itemClosingTagIndex: number) {
        return content.substring(0, itemClosingTagIndex).trim();
    }

    resolveAndIndexContentChunkItem(
        singleContentChunkContent: string,
        item: ContentItem,
        lastContentChunkHeading: string
    ) {
        const contentChunkClosingTagIndex = singleContentChunkContent.indexOf(ContentChunkMarkEnd);
        const contentChunkContent = this.retrieveItemContent(singleContentChunkContent, contentChunkClosingTagIndex);

        if (this.isNonEmpty(contentChunkContent)) {
            const { contentWithoutPlatformLabel, itemWithPlatform } = this.resolvePlatformElement(
                contentChunkContent,
                item
            );

            lastContentChunkHeading = this.indexContentChunkItem(
                contentWithoutPlatformLabel,
                lastContentChunkHeading,
                itemWithPlatform
            );
        }

        return lastContentChunkHeading;
    }

    indexContentChunkItem(
        contentWithoutPlatformLabel: string,
        lastContentChunkHeading: string,
        itemWithPlatform: ContentItem
    ) {
        const contentChunkContentSplitByHeadings = contentWithoutPlatformLabel.split(ContentChunkHeadingMarkStart);

        for (const singleHeadingContentChunkContent of contentChunkContentSplitByHeadings) {
            const { heading, content } = this.splitHeadingAndContent(
                singleHeadingContentChunkContent,
                ContentChunkHeadingMarkEnd
            );
            const currentHeading = this.getCurrentHeading(heading, lastContentChunkHeading);

            this.indexContentSplitByInnerItems(content, currentHeading, itemWithPlatform);

            lastContentChunkHeading = currentHeading;
        }

        return lastContentChunkHeading;
    }

    retrieveLeftoverContent(content: string, itemClosingTagIndex: number, itemMarkEnd: string) {
        return content.substring(itemClosingTagIndex).replace(itemMarkEnd, ' ');
    }

    getCurrentHeading(currentHeading: string, previousHeading: string) {
        return this.isNonEmpty(currentHeading) ? currentHeading : previousHeading;
    }

    indexLeftoverContent(content: string, heading: string, item: ContentItem) {
        if (content.includes(InnerItemMarkStart)) {
            this.indexContentSplitByInnerItems(content, heading, item);
        } else {
            this.indexLeftoverContentWithoutInnerItems(content, heading, item);
        }
    }

    indexTrainingContent(textToIndex: string, item: ContentItem) {
        if (item.system.type !== TRAINING_COURSE_CONTENT_TYPE) {
            throw Error(`Cannot index training content due to invalid training content item`);
        }

        const textToIndexWithoutTags = striptags(textToIndex).trim();

        this.addItemRecord(textToIndexWithoutTags, item.title.value, item);
    }

    indexContentSplitByInnerItems(singleHeadingContent: string, heading: string, item: ContentItem) {
        const contentSplitByInnerItems = singleHeadingContent.split(InnerItemMarkStart);

        for (const content of contentSplitByInnerItems) {
            const innerItemClosingTagIndex = content.indexOf(InnerItemMarkEnd);
            const innerItemContent = this.retrieveItemContent(content, innerItemClosingTagIndex);

            if (this.isNonEmpty(innerItemContent)) {
                this.indexInnerItem(innerItemContent, heading, item);
            }

            const leftoverContent = this.retrieveLeftoverContent(content, innerItemClosingTagIndex, InnerItemMarkEnd);
            this.indexLeftoverContentWithoutInnerItems(leftoverContent, heading, item);
        }
    }

    indexInnerItem(innerItemContent: string, heading: string, item: ContentItem) {
        const contentWithHeadingsInCodeSamples = replaceHeadingMarksWithTags(innerItemContent);

        if (contentWithHeadingsInCodeSamples.includes(PlatformMarkStart)) {
            const { contentWithoutPlatformLabel, itemWithPlatform } = this.resolvePlatformElement(
                contentWithHeadingsInCodeSamples,
                item
            );
            this.addItemRecord(contentWithoutPlatformLabel, heading, itemWithPlatform);
        } else {
            this.addItemRecord(contentWithHeadingsInCodeSamples, heading, item);
        }
    }

    indexLeftoverContentWithoutInnerItems(leftoverContent: string, heading: string, item: ContentItem) {
        const contentWithoutMarkdown = striptags(leftoverContent).trim();

        if (this.isNonEmpty(contentWithoutMarkdown)) {
            this.addItemRecord(contentWithoutMarkdown, heading, item);
        }
    }

    resolvePlatformElement(innerItemContent: string, item: ContentItem) {
        const platformExtractor = new RegExp(`${PlatformMarkStart}([\\s|\\S]*?)${PlatformMarkEnd}`);
        const match = platformExtractor.exec(innerItemContent);

        if (match && match[1]) {
            const contentWithoutPlatformLabel = innerItemContent.replace(platformExtractor, ' ');
            const platformsCodenames = match[1].split(',');

            const itemWithPlatform: ContentItem = {
                ...item,
                getAllElements: () => item.getAllElements(),
                platform: {
                    name: 'virtualPlatform',
                    rawData: {} as any,
                    taxonomyGroup: '',
                    type: 'taxonomy',
                    value: []
                } as Elements.TaxonomyElement
            };

            for (const platformCodename of platformsCodenames) {
                itemWithPlatform.platform.value.push({
                    codename: platformCodename
                });
            }

            return {
                contentWithoutPlatformLabel,
                itemWithPlatform
            };
        }

        return {
            contentWithoutPlatformLabel: innerItemContent,
            itemWithPlatform: item
        };
    }

    addItemRecord(content: string, heading: string, item: ContentItem) {
        const title = this.geTitleForItem(item);
        const id = item.system.id;
        const codename = this.getIndexCodenameForItem(item);
        const order = this.itemRecords.length + 1;
        const objectID = this.getIndexObjectIdForItem(item, order);
        const platforms = this.getPlatforms(item);
        const isCodeSample = content.includes(IsCodeSampleIdentifierMarkup);

        if (isCodeSample) {
            content = content.replace(IsCodeSampleIdentifierMarkup, '');
        }

        this.itemRecords.push({
            content,
            id,
            title,
            heading,
            codename,
            order,
            objectID,
            platforms,
            section: this.getSection(item),
            isCodeSample
        });
    }

    getSection(item: ContentItem) {
        if (item.system.type === TRAINING_COURSE_CONTENT_TYPE) {
            return 'training';
        }
        return 'tutorials';
    }

    geTitleForItem(item: ContentItem) {
        const itemType = item.system.type;
        if (itemType === TERM_DEFINITION_CONTENT_TYPE) {
            return item.term.value;
        }
        if (itemType === RELEASE_NOTE_CONTENT_TYPE) {
            return item.title.value;
        }

        if (item.title) {
            // if item has title element use it as title for index
            return item.title.value;
        }

        // default to system name
        return item.system.name;
    }

    getIndexObjectIdForItem(item: ContentItem, order: number) {
        return item.system.codename + '_' + order;
    }

    getIndexCodenameForItem(item: ContentItem) {
        const itemType = item.system.type;

        // term definitions are indexed under shared codename
        if (itemType === TERM_DEFINITION_CONTENT_TYPE) {
            // hardcoded for now, to be changed once web is updated
            return 'terminology';
        }
        // release notes are indexed under shared codename
        if (itemType === RELEASE_NOTE_CONTENT_TYPE) {
            // hardcoded for now, to be changed once web is updated
            return 'product_changelog';
        }

        return item.system.codename;
    }

    getPlatforms(item: ContentItem): string[] {
        const platforms: string[] = [];

        if (item.platform) {
            item.platform.value.forEach((platform: { codename: string }) => platforms.push(platform.codename));
        }

        return platforms;
    }

    isNonEmpty(content: string) {
        return content !== null && content !== '';
    }
}
