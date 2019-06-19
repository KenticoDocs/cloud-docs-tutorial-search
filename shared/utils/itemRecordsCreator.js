const { replaceHeadingMarksWithTags } = require('./codeSamplesUtils');
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

function getItemRecordsCreator() {
    return new ItemRecordsCreator();
}

class ItemRecordsCreator {
    constructor() {
        this.itemRecords = [];
    }

    async createItemRecords(item, textToIndex) {
        const contentSplitByHeadings = textToIndex.split('<h2>');
        this.itemRecords = [];

        for (const singleHeadingContent of contentSplitByHeadings) {
            const { heading, content } = this.splitHeadingAndContent(singleHeadingContent, '</h2>');

            if (content.includes(ContentChunkMarkStart)) {
                await this.indexContentSplitByContentChunks(content, heading, item);
            } else {
                await this.indexLeftoverContent(content, heading, item);
            }
        }

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

    async indexContentSplitByContentChunks(content, heading, item) {
        const contentSplitByContentChunks = content.split(ContentChunkMarkStart);
        let lastContentChunkHeading = heading;

        for (const singleContentChunkContent of contentSplitByContentChunks) {
            lastContentChunkHeading = await this.resolveAndIndexContentChunkItem(
                singleContentChunkContent,
                item,
                lastContentChunkHeading);

            const contentChunkClosingTagIndex = singleContentChunkContent.indexOf(ContentChunkMarkEnd);
            const leftoverContent = this.retrieveLeftoverContent(
                singleContentChunkContent,
                contentChunkClosingTagIndex,
                ContentChunkMarkEnd);

            const leftoverContentHeading = this.getCurrentHeading(lastContentChunkHeading, heading);
            await this.indexLeftoverContent(leftoverContent, leftoverContentHeading, item);
        }
    }

    retrieveItemContent(content, itemClosingTagIndex) {
        return content.substring(0, itemClosingTagIndex).trim();
    }

    async resolveAndIndexContentChunkItem(singleContentChunkContent, item, lastContentChunkHeading) {
        const contentChunkClosingTagIndex = singleContentChunkContent.indexOf(ContentChunkMarkEnd);
        const contentChunkContent = this.retrieveItemContent(singleContentChunkContent, contentChunkClosingTagIndex);

        if (this.isNonEmpty(contentChunkContent)) {
            const {
                contentWithoutPlatformLabel,
                itemWithPlatform,
            } = this.resolvePlatformElement(contentChunkContent, item);

            lastContentChunkHeading = await this.indexContentChunkItem(
                contentWithoutPlatformLabel,
                lastContentChunkHeading,
                itemWithPlatform);
        }

        return lastContentChunkHeading
    }

    async indexContentChunkItem(contentWithoutPlatformLabel, lastContentChunkHeading, itemWithPlatform) {
        const contentChunkContentSplitByHeadings = contentWithoutPlatformLabel.split(ContentChunkHeadingMarkStart);

        for (const singleHeadingContentChunkContent of contentChunkContentSplitByHeadings) {
            const { heading, content } = this.splitHeadingAndContent(singleHeadingContentChunkContent, ContentChunkHeadingMarkEnd);
            const currentHeading = this.getCurrentHeading(heading, lastContentChunkHeading);

            await this.indexContentSplitByInnerItems(
                content,
                currentHeading,
                itemWithPlatform);

            lastContentChunkHeading = currentHeading;
        }

        return lastContentChunkHeading;
    }

    retrieveLeftoverContent(content, itemClosingTagIndex, itemMarkEnd) {
        return content
            .substring(itemClosingTagIndex)
            .replace(itemMarkEnd, ' ');
    }

    getCurrentHeading(currentHeading, previousHeading) {
        return this.isNonEmpty(currentHeading)
               ? currentHeading
               : previousHeading;
    }

    async indexLeftoverContent(content, heading, item) {
        if (content.includes(InnerItemMarkStart)) {
            await this.indexContentSplitByInnerItems(content, heading, item);
        } else {
            await this.indexLeftoverContentWithoutInnerItems(content, heading, item);
        }
    }

    async indexContentSplitByInnerItems(singleHeadingContent, heading, item) {
        const contentSplitByInnerItems = singleHeadingContent.split(InnerItemMarkStart);

        for (const content of contentSplitByInnerItems) {
            const innerItemClosingTagIndex = content.indexOf(InnerItemMarkEnd);
            const innerItemContent = this.retrieveItemContent(content, innerItemClosingTagIndex);

            if (this.isNonEmpty(innerItemContent)) {
                await this.indexInnerItem(innerItemContent, heading, item);
            }

            const leftoverContent = this.retrieveLeftoverContent(
                content,
                innerItemClosingTagIndex,
                InnerItemMarkEnd);
            await this.indexLeftoverContentWithoutInnerItems(leftoverContent, heading, item);
        }
    }

    async indexInnerItem(innerItemContent, heading, item) {
        const contentWithHeadingsInCodeSamples = replaceHeadingMarksWithTags(innerItemContent);

        if (contentWithHeadingsInCodeSamples.includes(PlatformMarkStart)) {
            const {
                contentWithoutPlatformLabel,
                itemWithPlatform,
            } = this.resolvePlatformElement(contentWithHeadingsInCodeSamples, item);
            await this.addItemRecord(contentWithoutPlatformLabel, heading, itemWithPlatform);
        } else {
            await this.addItemRecord(contentWithHeadingsInCodeSamples, heading, item);
        }
    }

    async indexLeftoverContentWithoutInnerItems(leftoverContent, heading, item) {
        const contentWithoutMarkdown = striptags(leftoverContent).trim();

        if (this.isNonEmpty(contentWithoutMarkdown)) {
            await this.addItemRecord(contentWithoutMarkdown, heading, item);
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

    async addItemRecord(content, heading, item) {
        const title = item.title && item.title.value;
        const id = item.system.id;
        const codename = item.system.codename;
        const order = this.itemRecords.length + 1;
        const objectID = codename + '_' + order;
        const platforms = this.getPlatforms(item);

        this.itemRecords.push({
            content,
            id,
            title,
            heading,
            codename,
            order,
            objectID,
            platforms,
            section: 'tutorials'
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
}

module.exports = {
    getItemRecordsCreator,
    ItemRecordsCreator,
};
