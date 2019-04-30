function getRelevantItems(items, types) {
    return items
        .filter(item => types.includes(item.type))
        .map(item => {
            return {
                type: item.type,
                codename: item.codename,
            };
        });
}

module.exports = getRelevantItems;
