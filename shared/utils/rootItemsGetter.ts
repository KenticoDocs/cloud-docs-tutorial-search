import { ContentItem } from '@kentico/kontent-delivery';
import { ROOT_CONTENT_TYPES } from '../external/constants';
import { CodeSamples } from '../models/code_samples';
import { IRelevantItem } from './itemFilter';

interface IProcessItemContext {
    visitedItems: string[];
    rootItemCodenames: string[];
    newItemsToVisit: ContentItem[];
    allItems: ContentItem[];
}

export function getRootCodenamesOfSingleItem(item: IRelevantItem, allItems: ContentItem[]) {
    if (ROOT_CONTENT_TYPES.includes(item.type)) {
        return [item.codename];
    }

    return getRootParents(item.codename, allItems);
}

function getRootParents(codename: string, allItems: ContentItem[]) {
    let itemsToVisit = getDirectParents(codename, allItems);
    const visitedItems: string[] = [];
    const rootItemCodenames: string[] = [];

    while (itemsToVisit.length > 0) {
        const newItemsToVisit: ContentItem[] = [];

        itemsToVisit.forEach((item) =>
            processItem(item, { visitedItems, rootItemCodenames, newItemsToVisit, allItems })
        );

        itemsToVisit = newItemsToVisit;
    }

    return rootItemCodenames;
}

function processItem(item: ContentItem, context: IProcessItemContext) {
    const itemCodename = item.system.codename;

    if (context.visitedItems.includes(itemCodename)) {
        return;
    }
    context.visitedItems.push(itemCodename);

    if (ROOT_CONTENT_TYPES.includes(item.system.type)) {
        context.rootItemCodenames.push(itemCodename);
    } else {
        const parents = getDirectParents(itemCodename, context.allItems);
        parents.forEach((parent) => context.newItemsToVisit.push(parent));
    }
}

function getDirectParents(codename: string, allItems: ContentItem[]) {
    return allItems.filter((item) => checkIfItemIsParent(item, codename));
}

function checkIfItemIsParent(item: ContentItem, codename: string) {
    switch (item.system.type) {
        case 'code_samples':
            return (item as CodeSamples).codeSamples.value.map((m) => m.system.codename).includes(codename);
        case 'article':
        case 'scenario':
            return (
                item.content.linkedItemCodenames.includes(codename) ||
                item.introduction.linkedItemCodenames.includes(codename)
            );
        case 'callout':
        case 'content_chunk':
            return item.content.linkedItemCodenames.includes(codename);
        default:
            return false;
    }
}
