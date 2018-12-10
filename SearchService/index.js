const kenticoClient = require('./external/kentico');
const searchIndex = require('./external/search');
const createIndexableArticle = require('./utils/indexableArticleCreator');

function addArticleObjects() {
  kenticoClient
    .items()
    .type('article')
    .getObservable()
    .subscribe(response => indexData(response.items));
}

function indexData(articles) {
  articles.forEach(article => indexArticle(article));
}

function indexArticle(article) {
  if (article && article.content && article.content.value) {
    const articleObject = createIndexableArticle(article);
    if (articleObject[0].description && articleObject[0].title) {
      searchIndex.saveObjects(articleObject);
    }
  }
}

module.exports = async (context, queueItem) => {
  addArticleObjects();

  context.log('JavaScript queue trigger function processed work item', queueItem);
};