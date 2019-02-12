const KenticoCloud = require('kentico-cloud-delivery');
const Article = require('../models/article');
const { keys } = require('./keys');

let kenticoClient;

const typeResolvers = [
    new KenticoCloud.TypeResolver('article', () => new Article()),
];

function getKenticoClient() {
    if (kenticoClient === undefined) {
        kenticoClient = new KenticoCloud.DeliveryClient({
            projectId: keys.kenticoProjectId,
            typeResolvers: typeResolvers
        });
    }

    return kenticoClient;
}

module.exports = getKenticoClient;
