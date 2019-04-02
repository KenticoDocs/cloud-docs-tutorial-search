function getCodenamesAndTypesOfItems(items, types) {
    const codenamesAndTypes = [];

    items.map(item => {
        if (types.includes(item.type)) {
            codenamesAndTypes.push({
                type: item.type,
                codename: item.codename
            });
        }
    });

    return codenamesAndTypes;
}

module.exports = getCodenamesAndTypesOfItems;
