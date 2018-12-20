function getCodenamesOfItems(items, itemType) {
    const codenames = [];

    items.map(item => {
        if (item.type === itemType) {
            codenames.push(item.codename);
        }
    });

    return codenames;
}

module.exports = getCodenamesOfItems;
