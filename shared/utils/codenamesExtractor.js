function getCodenamesOfItems(items, itemTypes) {
    const codenames = [];

    items.map(item => {
        if (itemTypes.includes(item.type)) {
            codenames.push(item.codename);
        }
    });

    return codenames;
}

module.exports = getCodenamesOfItems;
