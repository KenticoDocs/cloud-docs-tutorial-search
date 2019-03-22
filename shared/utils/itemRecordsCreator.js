const removeMarkdown = require('remove-markdown');
const {
    PlatformMarkStart,
    PlatformMarkEnd,
    InnerItemMarkStart,
    InnerItemMarkEnd,
} = require('./richTextLabels');

class ItemRecordsCreator {
    constructor() {
        this.itemRecords = [];
    }

    createItemRecords(item, textToIndex) {
        const contentSplitByHeadings = textToIndex.split('<h2>');
        this.itemRecords = [];

        contentSplitByHeadings.forEach((singleHeadingContent) => {
            const { heading, content } = this.splitHeadingAndContent(singleHeadingContent);

            if (content.includes(InnerItemMarkStart)) {
                this.indexContentSplitByInnerItems(content, heading, item);
            } else {
                this.indexLeftoverContentWithoutInnerItems(content, heading, item);
            }
        });

        return this.itemRecords;
    }

    splitHeadingAndContent(content) {
        const contentParts = content.split('</h2>');

        return (contentParts.length > 1) ?
            {
                heading: removeMarkdown(contentParts[0]).trim(),
                content: contentParts[1].trim(),
            } :
            {
                heading: '',
                content: contentParts[0].trim(),
            }
    }

    indexContentSplitByInnerItems(singleHeadingContent, heading, item) {
        const contentSplitByInnerItems = singleHeadingContent.split(InnerItemMarkStart);

        contentSplitByInnerItems.forEach(content => {
            const innerItemClosingTagIndex = content.indexOf(InnerItemMarkEnd);
            const innerItemContent = content.substring(0, innerItemClosingTagIndex).trim();

            if (this.isNonEmpty(innerItemContent)) {
                this.indexInnerItem(innerItemContent, heading, item);
            }
            const leftoverContent = content
                .substring(innerItemClosingTagIndex)
                .replace(InnerItemMarkEnd, ' ');

            this.indexLeftoverContentWithoutInnerItems(leftoverContent, heading, item);
        });
    }

    indexInnerItem(innerItemContent, heading, item) {
        if (innerItemContent.includes(PlatformMarkStart)) {
            const {
                contentWithoutPlatformLabel,
                itemWithPlatform,
            } = this.resolveInnerItemPlatform(innerItemContent, item);
            this.addItemRecord(contentWithoutPlatformLabel, heading, itemWithPlatform);
        } else {
            this.addItemRecord(innerItemContent, heading, item);
        }
    }

    resolveInnerItemPlatform(innerItemContent, item) {
        const platformExtractor = new RegExp(`${PlatformMarkStart}([\\s|\\S]*?)${PlatformMarkEnd}`, 'g');
        const match = platformExtractor.exec(innerItemContent);

        if (match && match[1]) {
            const contentWithoutPlatformLabel = innerItemContent.replace(platformExtractor, ' ');
            return {
                contentWithoutPlatformLabel,
                itemWithPlatform: {
                    ...item,
                    platform: {
                        value: [{
                            codename: match[1]
                        }]
                    }
                }
            };
        }

        return {
            innerItemContent,
            item,
        };
    }

    indexLeftoverContentWithoutInnerItems(leftoverContent, heading, item) {
        const contentWithoutMarkdown = removeMarkdown(leftoverContent).trim();

        if (this.isNonEmpty(contentWithoutMarkdown)) {
            this.addItemRecord(contentWithoutMarkdown, heading, item);
        }
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
            platforms
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
            .trim();
    }
}

module.exports = ItemRecordsCreator;
