const removeMarkdown = require('remove-markdown');

class ItemRecordsCreator {
    constructor() {
        this.itemRecords = [];
    }

    createItemRecords(item, textToIndex) {
        const contentSplitByHeadings = textToIndex.split('<h2>');
        this.itemRecords = [];

        contentSplitByHeadings.forEach((singleHeadingContent) => {
            const { heading, content } = this.splitHeadingAndContent(singleHeadingContent);

            if (content.includes('<callout>')) {
                this.indexContentSplitByCallouts(content, heading, item);
            } else {
                this.indexLeftoverContentWithoutCallouts(content, heading, item);
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

    indexContentSplitByCallouts(singleHeadingContent, heading, item) {
        const contentSplitByCallouts = singleHeadingContent.split('<callout>');

        contentSplitByCallouts.forEach(content => {
            const calloutClosingTagIndex = content.indexOf('</callout>');
            const calloutContent = content.substring(0, calloutClosingTagIndex).trim();

            if (this.isNonEmpty(calloutContent)) {
                this.addItemRecord(calloutContent, heading, item);
            }
            const leftoverContent = content.substring(calloutClosingTagIndex);

            this.indexLeftoverContentWithoutCallouts(leftoverContent, heading, item);
        });
    }

    indexLeftoverContentWithoutCallouts(leftoverContent, heading, item) {
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

        this.itemRecords.push({
            content: this.sanitizeContent(content),
            id,
            title,
            heading,
            codename,
            order,
            objectID,
        });
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
