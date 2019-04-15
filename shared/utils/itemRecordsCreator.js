const striptags = require('striptags');
const {
    PlatformMarkStart,
    PlatformMarkEnd,
    InnerItemMarkStart,
    InnerItemMarkEnd,
    ContentChunkMarkStart,
    ContentChunkMarkEnd,
    ContentChunkHeadingMarkStart,
    ContentChunkHeadingMarkEnd,
} = require('./richTextLabels');

class ItemRecordsCreator {
    constructor() {
        this.itemRecords = [];
    }

    createItemRecords(item, textToIndex) {
        const contentSplitByHeadings = textToIndex.split('<h2>');
        this.itemRecords = [];

        contentSplitByHeadings.forEach(singleHeadingContent => {
            const { heading, content } = this.splitHeadingAndContent(singleHeadingContent, '</h2>');

            if (content.includes(ContentChunkMarkStart)) {
                this.indexContentSplitByContentChunks(content, heading, item);
            } else {
                this.indexLeftoverContent(content, heading, item);
            }
        });

        return this.itemRecords;
    }

    splitHeadingAndContent(content, headingMarkEnd) {
        const contentParts = content.split(headingMarkEnd);

        return (contentParts.length > 1) ?
            {
                heading: striptags(contentParts[0]).trim(),
                content: contentParts[1].trim(),
            } :
            {
                heading: '',
                content: contentParts[0].trim(),
            }
    }

    indexContentSplitByContentChunks(content, heading, item) {
        const contentSplitByContentChunks = content.split(ContentChunkMarkStart);

        contentSplitByContentChunks.forEach(singleContentChunkContent => {
            const contentChunkClosingTagIndex = singleContentChunkContent.indexOf(ContentChunkMarkEnd);
            const contentChunkContent = this.retrieveItemContent(singleContentChunkContent, contentChunkClosingTagIndex);
            let lastContentChunkHeading = '';

            if (this.isNonEmpty(contentChunkContent)) {
                lastContentChunkHeading = this.indexContentChunkItem(contentChunkContent, item, lastContentChunkHeading);
            }

            const leftoverContent = this.retrieveLeftoverContent(
                singleContentChunkContent,
                contentChunkClosingTagIndex,
                ContentChunkMarkEnd);
            const leftoverContentHeading = this.isNonEmpty(lastContentChunkHeading)
                                           ? lastContentChunkHeading
                                           : heading;
            this.indexLeftoverContent(leftoverContent, leftoverContentHeading, item);
        });
    }

    retrieveItemContent(content, itemClosingTagIndex) {
        return content.substring(0, itemClosingTagIndex).trim();
    }

    indexContentChunkItem(contentChunkContent, item, lastContentChunkHeading) {
        const {
            contentWithoutPlatformLabel,
            itemWithPlatform,
        } = this.resolvePlatformElement(contentChunkContent, item);

        const contentChunkContentSplitByHeadings = contentWithoutPlatformLabel.split(ContentChunkHeadingMarkStart);

        contentChunkContentSplitByHeadings.forEach(singleHeadingContentChunkContent => {
            const { heading, content } = this.splitHeadingAndContent(singleHeadingContentChunkContent, ContentChunkHeadingMarkEnd);
            this.indexContentSplitByInnerItems(content, heading, itemWithPlatform);
            lastContentChunkHeading = heading;
        });

        return lastContentChunkHeading;
    }

    retrieveLeftoverContent(content, itemClosingTagIndex, itemMarkEnd) {
        return content
            .substring(itemClosingTagIndex)
            .replace(itemMarkEnd, ' ');
    }

    indexLeftoverContent(content, heading, item) {
        if (content.includes(InnerItemMarkStart)) {
            this.indexContentSplitByInnerItems(content, heading, item);
        } else {
            this.indexLeftoverContentWithoutInnerItems(content, heading, item);
        }
    }

    indexContentSplitByInnerItems(singleHeadingContent, heading, item) {
        const contentSplitByInnerItems = singleHeadingContent.split(InnerItemMarkStart);

        contentSplitByInnerItems.forEach(content => {
            const innerItemClosingTagIndex = content.indexOf(InnerItemMarkEnd);
            const innerItemContent = this.retrieveItemContent(content, innerItemClosingTagIndex);

            if (this.isNonEmpty(innerItemContent)) {
                this.indexInnerItem(innerItemContent, heading, item);
            }

            const leftoverContent = this.retrieveLeftoverContent(
                content,
                innerItemClosingTagIndex,
                InnerItemMarkEnd);
            this.indexLeftoverContentWithoutInnerItems(leftoverContent, heading, item);
        });
    }

    indexInnerItem(innerItemContent, heading, item) {
        if (innerItemContent.includes(PlatformMarkStart)) {
            const {
                contentWithoutPlatformLabel,
                itemWithPlatform,
            } = this.resolvePlatformElement(innerItemContent, item);
            this.addItemRecord(contentWithoutPlatformLabel, heading, itemWithPlatform);
        } else {
            this.addItemRecord(innerItemContent, heading, item);
        }
    }

    indexLeftoverContentWithoutInnerItems(leftoverContent, heading, item) {
        const contentWithoutMarkdown = striptags(leftoverContent).trim();

        if (this.isNonEmpty(contentWithoutMarkdown)) {
            this.addItemRecord(contentWithoutMarkdown, heading, item);
        }
    }

    resolvePlatformElement(innerItemContent, item) {
        const platformExtractor = new RegExp(`${PlatformMarkStart}([\\s|\\S]*?)${PlatformMarkEnd}`);
        const match = platformExtractor.exec(innerItemContent);

        if (match && match[1]) {
            const contentWithoutPlatformLabel = innerItemContent.replace(platformExtractor, ' ');
            const platformsCodenames = match[1].split(',');

            const itemWithPlatform = {
                ...item,
                platform: {
                    value: [],
                },
            };

            for (const platformCodename of platformsCodenames) {
                itemWithPlatform.platform.value.push({
                    codename: platformCodename,
                })
            }

            return {
                contentWithoutPlatformLabel,
                itemWithPlatform,
            };
        }

        return {
            contentWithoutPlatformLabel: innerItemContent,
            itemWithPlatform: item,
        };
    }

    addItemRecord(content, heading, item) {
        const title = item.title && item.title.value;
        const id = item.system.id;
        const codename = item.system.codename;
        const order = this.itemRecords.length + 1;
        const objectID = codename + '_' + order;
        const platforms = this.getPlatforms(item);

        this.itemRecords.push({
            content: this.sanitizeContent(content),
            id,
            title,
            heading,
            codename,
            order,
            objectID,
            platforms,
        });
    }

    getPlatforms(item) {
        const platforms = [];

        if (item.platform) {
            item.platform.value.forEach(
                platform => platforms.push(platform.codename));
        }

        return platforms;
    }

    isNonEmpty(content) {
        return content !== null && content !== '';
    }

    sanitizeContent(content) {
        return content
            .replace(/\n/g, ' ')
            .replace(/\s{2}/g, ' ')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .trim();
    }
}

module.exports = ItemRecordsCreator;
