const KenticoCloud = require('kentico-cloud-delivery');
const appKeys = require('./keys');
const Article = require('../models/article');

const typeResolvers = [
  new KenticoCloud.TypeResolver('article', () => new Article()),
];

const kenticoClient = new KenticoCloud.DeliveryClient({
  projectId: appKeys.kenticoProjectId,
  typeResolvers: typeResolvers
});

module.exports = kenticoClient;
