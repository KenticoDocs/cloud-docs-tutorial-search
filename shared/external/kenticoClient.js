const KenticoCloud = require('kentico-cloud-delivery');
const Article = require('../models/article');
const { keys } = require('./configuration');

let kenticoClient;

const typeResolvers = [
    new KenticoCloud.TypeResolver('article', () => new Article()),
];

function getKenticoClient() {
    if (kenticoClient === undefined) {
        kenticoClient = new KenticoCloud.DeliveryClient({
            projectId: keys.kenticoProjectId,
            enableSecuredMode: true,
            securedApiKey: keys.securedApiKey,
            typeResolvers,
        });
    }

    return kenticoClient;
}

module.exports = getKenticoClient;
