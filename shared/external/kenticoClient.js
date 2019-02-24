const KenticoCloud = require('kentico-cloud-delivery');
const Article = require('../models/article');
const Scenario = require('../models/scenario');
const { keys } = require('./configuration');

const typeResolvers = [
    new KenticoCloud.TypeResolver('article', () => new Article()),
    new KenticoCloud.TypeResolver('scenario', () => new Scenario()),
];

function getKenticoClient() {
    return new KenticoCloud.DeliveryClient({
        projectId: keys.kenticoProjectId,
        enableSecuredMode: true,
        securedApiKey: keys.securedApiKey,
        typeResolvers,
    });
}

module.exports = getKenticoClient;
