const KenticoCloud = require('kentico-cloud-delivery');
const Article = require('../models/article');
const Scenario = require('../models/scenario');
const CodeSamples = require('../models/code_samples');
const CodeSample = require('../models/code_sample');
const TermDefinition = require('../models/term_definition');
const RELEASE_NOTE_CONTENT_TYPE = require('../models/release_note');
const Configuration = require('./configuration');

const typeResolvers = [
    new KenticoCloud.TypeResolver('article', () => new Article()),
    new KenticoCloud.TypeResolver('scenario', () => new Scenario()),
    new KenticoCloud.TypeResolver('code_samples', () => new CodeSamples()),
    new KenticoCloud.TypeResolver('code_sample', () => new CodeSample()),
    new KenticoCloud.TypeResolver('term_definition', () => new TermDefinition()),
    new KenticoCloud.TypeResolver('release_note', () => new RELEASE_NOTE_CONTENT_TYPE()),
];

function getKenticoClient() {
    return new KenticoCloud.DeliveryClient({
        projectId: Configuration.keys.kenticoProjectId,
        enableSecuredMode: true,
        securedApiKey: Configuration.keys.securedApiKey,
        typeResolvers,
        globalHeaders: [
            {
                header: 'X-KC-Wait-For-Loading-New-Content',
                value: 'true',
            },
        ],
    });
}

module.exports = getKenticoClient;
