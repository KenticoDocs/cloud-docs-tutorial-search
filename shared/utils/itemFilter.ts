import { IWebhookContentItem } from 'kontent-docs-shared-code';

export interface IRelevantItem {
    type: string;
    codename: string;
}

export function getRelevantItems(items: IWebhookContentItem[], types: string[]): IRelevantItem[] {
    return items
        .filter((item) => types.includes(item.type))
        .map((item) => {
            return {
                type: item.type,
                codename: item.codename
            };
        });
}
