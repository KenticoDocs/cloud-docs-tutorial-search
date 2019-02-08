const KenticoCloud = require('kentico-cloud-delivery');
const appKeys = require('./keys');
const Article = require('../models/article');

let kenticoClient;

const typeResolvers = [
    new KenticoCloud.TypeResolver('article', () => new Article()),
];

function getKenticoClient(){
    if (kenticoClient === null) {
        kenticoClient = new KenticoCloud.DeliveryClient({
            projectId: appKeys.kenticoProjectId,
            typeResolvers: typeResolvers
        });
    }

    return kenticoClient;
}

module.exports = getKenticoClient;
