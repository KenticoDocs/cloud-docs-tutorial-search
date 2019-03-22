const KenticoCloud = require('kentico-cloud-delivery');
const Article = require('../models/article');
const Scenario = require('../models/scenario');
const CodeSamples = require('../models/code_samples');
const CodeSample = require('../models/code_sample');
const { keys } = require('./configuration');

const typeResolvers = [
    new KenticoCloud.TypeResolver('article', () => new Article()),
    new KenticoCloud.TypeResolver('scenario', () => new Scenario()),
    new KenticoCloud.TypeResolver('code_samples', () => new CodeSamples()),
    new KenticoCloud.TypeResolver('code_sample', () => new CodeSample()),
];

function getKenticoClient() {
    return new KenticoCloud.DeliveryClient({
        projectId: keys.kenticoProjectId,
        enableSecuredMode: true,
        securedApiKey: keys.securedApiKey,
        typeResolvers,
        globalHeaders: [
            {
                header: 'X-KC-Wait-For-Loading-New-Content',
                value: 'true'
            }
        ],
    });
}

module.exports = getKenticoClient;
