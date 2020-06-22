const KenticoKontent = require('@kentico/kontent-delivery');
const Article = require('../models/article');
const Scenario = require('../models/scenario');
const CodeSamples = require('../models/code_samples');
const CodeSample = require('../models/code_sample');
const TermDefinition = require('../models/term_definition');
const RELEASE_NOTE_CONTENT_TYPE = require('../models/release_note');
const Configuration = require('./configuration');

const typeResolvers = [
    new KenticoKontent.TypeResolver('article', () => new Article()),
    new KenticoKontent.TypeResolver('scenario', () => new Scenario()),
    new KenticoKontent.TypeResolver('code_samples', () => new CodeSamples()),
    new KenticoKontent.TypeResolver('code_sample', () => new CodeSample()),
    new KenticoKontent.TypeResolver('term_definition', () => new TermDefinition()),
    new KenticoKontent.TypeResolver('release_note', () => new RELEASE_NOTE_CONTENT_TYPE()),
];

function getDeliveryClient() {
    return new KenticoKontent.DeliveryClient({
        projectId: Configuration.keys.kenticoProjectId,
        enableSecuredMode: true,
        secureApiKey: Configuration.keys.securedApiKey,
        typeResolvers,
        globalQueryConfig: {
            waitForLoadingNewContent: true,
            useSecuredMode: true
        }
    });
}

module.exports = getDeliveryClient;
