const { ROOT_CONTENT_TYPES } = require('./../external/constants');

function getRootCodenamesOfSingleItem(item, allItems) {
    const rootCodenames = [];

    if (!ROOT_CONTENT_TYPES.includes(item.type)) {
        const rootItems = getRootItemsCodenames(item.codename, allItems);
        rootItems.forEach(item => rootCodenames.push(item));
    } else {
        rootCodenames.push(item.codename);
    }

    return rootCodenames;
}

function getRootItemsCodenames(codename, allItems) {
    let invariant = getParents(codename, allItems);
    let parents = [];
    const rootItems = [];

    do {
        parents = invariant;
        invariant = [];

        const parentsKeys = Object.keys(parents);

        for (const key in parentsKeys) {
            const item = parents[key];

            saveCodenameIfItemIsRoot(item.system.codename, item.system.type, rootItems);
            invariant = invariant.concat(getParents(item.system.codename, allItems));
        }
    }
    while (invariant.length !== 0);

    return rootItems;
}

function getParents(codename, allItems) {
    const parents = [];

    for (const item of allItems) {
        const parent = checkIfItemIsParent(item, codename);
        if (parent !== null) {
            parents.push(parent);
        }
    }

    return parents;
}

function checkIfItemIsParent(item, codename) {
    if (item.system.type === 'code_samples') {
        if (item.elements.code_samples && item.elements.code_samples.value.includes(codename)) {
            return item;
        }
    } else if (itemHasChildItemWithCodename(item, codename)) {
        return item;
    }

    return null;
}

function itemHasChildItemWithCodename(item, codename) {
    return (item.elements.content
        && item.elements.content.modular_content
        && item.elements.content.modular_content.includes(codename))
        || (item.elements.introduction
            && item.elements.introduction.modular_content
            && item.elements.introduction.modular_content.includes(codename));
}

function saveCodenameIfItemIsRoot(codename, type, rootItems) {
    if (ROOT_CONTENT_TYPES.includes(type)) {
        rootItems.push(codename);
    }
}

module.exports = getRootCodenamesOfSingleItem;
