function parseCodenamesOfInstructionsFromText(text) {
    const instructionsCodenamesExtractor = /\|~instructions\|([\s|\S]*?)\|instructions~\|/g;
    const codenames = [];

    let match = instructionsCodenamesExtractor.exec(text);
    while (match !== null) {
        codenames.push(match[1]);
        match = instructionsCodenamesExtractor.exec(text);
    }

    return codenames;
}

function insertInstructionsContentIntoText(text, instructionsText) {
    if (text.includes('|~instructions|') && text.includes('|instructions~|')) {
        const start = text.indexOf('|~instructions|');
        const end = text.lastIndexOf('|instructions~|') + '|instructions~|'.length;

        return text.substring(0, start) + ` ${instructionsText} ` + text.substring(end);
    }

    return text;
}

module.exports = {
    parseCodenamesOfInstructionsFromText,
    insertInstructionsContentIntoText,
};
