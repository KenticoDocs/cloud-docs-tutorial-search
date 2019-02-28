const getSearchIndex = require('./external/searchIndex');
const getKenticoClient = require('./external/kenticoClient');
const ItemRecordsCreator = require('./utils/itemRecordsCreator');
const resolveItemInRichText = require('./utils/richTextResolver');
const insertLinkedCodeSamples = require('./utils/codeSamplesUtils');
const {
    parseCodenamesOfInstructionsFromText,
    insertInstructionsContentIntoText
} = require('./utils/instructionsUtils');
const { CONTENT_TYPES_TO_INITIALIZE } = require('./external/constants');
const { getInstructionsLabel } = require('./utils/richTextLabels');

const EXCLUDED_FROM_SEARCH = 'excluded_from_search';

function isItemExcludedFromSearch(item) {
    return item
        .elements
        .visibility
        .value
        .some(taxonomyTerm => taxonomyTerm.codename === EXCLUDED_FROM_SEARCH);
}

async function reindexAllItems() {
    await getSearchIndex().clearIndex();

    await getKenticoClient()
        .items()
        .types(CONTENT_TYPES_TO_INITIALIZE)
        .depthParameter(4)
        .queryConfig({
            richTextResolver: resolveItemInRichText
        })
        .getPromise()
        .then(async response => {
            const itemsToIndex = response.items.filter(item => !isItemExcludedFromSearch(item));
            const linkedItems = response.linkedItems;

            for (const item of itemsToIndex) {
                await resolveAndIndexItem(item, linkedItems);
            }
        });
}

async function reindexItems(codenames) {
    await codenames.forEach(
        codename => getKenticoClient()
            .item(codename)
            .depthParameter(4)
            .queryConfig({
                richTextResolver: resolveItemInRichText
            })
            .getPromise()
            .then(async ({ item, linkedItems }) => {
                await reindexItem(item, linkedItems);
            }));
}

async function reindexItem(item, linkedItems) {
    await deleteIndexedItem(item);

    if (item.system.type === 'instructions') {
        await reindexInstructionsItem(item);
    } else {
        if (!isItemExcludedFromSearch(item)) {
            await resolveAndIndexItem(item, linkedItems)
        }
    }
}

async function reindexInstructionsItem(instruction) {
    const { article, linkedItems } = await getArticleWithInstructionsItem(instruction);
    if (article) {
        instruction.title.value = resolveInstructionsItemTitle(instruction, article);
        const textToIndex = resolveInstructionsItemText(article.content.value, instruction, linkedItems);

        if (!isItemExcludedFromSearch(article)) {
            await indexItem(instruction, textToIndex);
        }
    }
}

async function getArticleWithInstructionsItem(instruction) {
    return getKenticoClient()
        .items()
        .type('article')
        .depthParameter(4)
        .queryConfig({
            richTextResolver: resolveItemInRichText
        })
        .getPromise()
        .then(response => {
            const instructionsItemIdentifier = getInstructionsLabel(instruction.system.codename);
            const articlesWithInstructionsItem = response.items.filter(article => article.content.getHtml().includes(instructionsItemIdentifier));

            if (articlesWithInstructionsItem.length === 1) {
                const article = articlesWithInstructionsItem[0];
                const linkedItems = response.linkedItems;
                article.content.value = article.introduction.getHtml() + ' ' + article.content.getHtml();

                return {
                    article,
                    linkedItems
                };
            }
        });
}

async function resolveAndIndexItem(item, linkedItems) {
    let textToIndex = item.introduction.getHtml() + ' ' + item.content.getHtml();

    if (textToIndex.includes('|~code_sample|')) {
        textToIndex = insertLinkedCodeSamples(textToIndex, linkedItems);
    }

    if (textToIndex.includes('|~instructions|')) {
        await indexLinkedInstructions(textToIndex, item, linkedItems);
    } else {
        await indexItem(item, textToIndex);
    }
}

async function indexLinkedInstructions(articleText, articleToIndex, linkedItems) {
    const instructionsCodenames = parseCodenamesOfInstructionsFromText(articleText);

    for (const instructionsCodename of instructionsCodenames) {
        const instructionsItems = linkedItems.filter(item => item.system.codename === instructionsCodename);
        const item = instructionsItems[0];
        item.title.value = resolveInstructionsItemTitle(item, articleToIndex);
        const textToIndex = resolveInstructionsItemText(articleText, item, linkedItems);

        await deleteIndexedItem(item);
        await indexItem(item, textToIndex);
    }
}

function resolveInstructionsItemText(articleText, item, linkedItems) {
    let textToIndex = insertInstructionsContentIntoText(articleText, item.content.getHtml());
    if (textToIndex.includes('|~code_sample|')) {
        textToIndex = insertLinkedCodeSamples(textToIndex, linkedItems);
    }

    return textToIndex;
}

function resolveInstructionsItemTitle(instruction, article) {
    return instruction.title.value === ''
           ? article.title.value
           : instruction.title.value;
}

async function indexItem(item, text) {
    const itemRecordsCreator = new ItemRecordsCreator();

    const itemRecords = itemRecordsCreator.createItemRecords(item, text);
    await getSearchIndex().saveObjects(itemRecords);
}

async function deleteIndexedItem(item) {
    await getSearchIndex().deleteBy({
        filters: `id:${item.system.id}`
    });
}

function deleteIndexedItems(codenames) {
    codenames.forEach(codename => getSearchIndex().deleteBy({
        filters: `codename:${codename}`
    }));
}

module.exports = {
    reindexAllItems,
    reindexItems,
    deleteIndexedItems
};
