const {
    InstructionsMarkStart,
    InstructionsMarkEnd,
} = require('./richTextLabels');

function parseCodenamesOfInstructionsFromText(text) {
    const instructionsCodenamesExtractor = new RegExp(`${InstructionsMarkStart}([\\s|\\S]*?)${InstructionsMarkEnd}`, 'g');
    const codenames = [];

    let match = instructionsCodenamesExtractor.exec(text);
    while (match !== null) {
        codenames.push(match[1]);
        match = instructionsCodenamesExtractor.exec(text);
    }

    return codenames;
}

function insertInstructionsContentIntoText(text, instructionsText) {
    if (text.includes(InstructionsMarkStart) && text.includes(InstructionsMarkEnd)) {
        const start = text.indexOf(InstructionsMarkStart);
        const end = text.lastIndexOf(InstructionsMarkEnd) + InstructionsMarkEnd.length;

        return text.substring(0, start) + ` ${instructionsText} ` + text.substring(end);
    }

    return text;
}

module.exports = {
    parseCodenamesOfInstructionsFromText,
    insertInstructionsContentIntoText,
};
