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

            if (content.includes('|~innerItem|')) {
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
        const innerItemClosingLabel = '|innerItem~|';
        const contentSplitByInnerItems = singleHeadingContent.split('|~innerItem|');

        contentSplitByInnerItems.forEach(content => {
            const innerItemClosingTagIndex = content.indexOf(innerItemClosingLabel);
            const innerItemContent = content.substring(0, innerItemClosingTagIndex).trim();

            if (this.isNonEmpty(innerItemContent)) {
                this.indexInnerItem(innerItemContent, heading, item);
            }
            const leftoverContent = content
                .substring(innerItemClosingTagIndex)
                .replace(innerItemClosingLabel, ' ');

            this.indexLeftoverContentWithoutInnerItems(leftoverContent, heading, item);
        });
    }

    indexInnerItem(innerItemContent, heading, item) {
        if (innerItemContent.includes('|~language|')) {
            const {
                contentWithoutLanguageLabel,
                itemWithLanguage,
            } = this.resolveInnerItemLanguage(innerItemContent, item);
            this.addItemRecord(contentWithoutLanguageLabel, heading, itemWithLanguage);
        } else {
            this.addItemRecord(innerItemContent, heading, item);
        }
    }

    resolveInnerItemLanguage(innerItemContent, item) {
        const languageExtractor = /\|~language\|([\s|\S]*?)\|language~\|/g;
        const match = languageExtractor.exec(innerItemContent);

        if (match && match[1]) {
            const contentWithoutLanguageLabel = innerItemContent.replace(languageExtractor, ' ');
            return {
                contentWithoutLanguageLabel,
                itemWithLanguage: {
                    ...item,
                    programmingLanguage: {
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
        const language = this.getLanguage(item);

        this.itemRecords.push({
            content: this.sanitizeContent(content),
            id,
            title,
            heading,
            codename,
            order,
            objectID,
            language
        });
    }

    getLanguage(item) {
        return item.programmingLanguage &&
               item.programmingLanguage.value.length === 1
                    ? item.programmingLanguage.value[0].codename
                    : '';
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
