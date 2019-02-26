function getCodenamesOfItems(items, types) {
    const codenames = [];

    items.map(item => {
        if (types.includes(item.type)) {
            codenames.push(item.codename);
        }
    });

    return codenames;
}

module.exports = getCodenamesOfItems;
