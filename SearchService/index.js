const kenticoClient = require('./external/kentico');
const searchIndex = require('./external/search');
const createIndexableArticle = require('./utils/indexableArticleCreator');
const getCodenamesOfItems = require('./utils/codenamesExtractor');
const validateEventGridEvent = require('./eventGridEventValidator');

function fetchAndIndexAllArticles() {
  kenticoClient
    .items()
    .type('article')
    .getObservable()
    .subscribe(response => indexDataFromKentico(response.items));
}

function fetchAndIndexArticlesFromKentico(codenames) {
  kenticoClient
    .items(codenames)
    .type('article')
    .getObservable()
    .subscribe(response => indexDataFromKentico(response.items));
}

function deleteIndexedArticles(codenames) {
  codenames.map(codename => deleteIndexedArticle(codename));
}

function indexDataFromKentico(items) {
  items.forEach(item => indexArticleFromKentico(item));
}

function indexArticleFromKentico(article) {
  if (article && article.content && article.content.value) {
    const articleObject = createIndexableArticle(article);
    if (articleObject[0].description && articleObject[0].title) {
      searchIndex.saveObjects(articleObject);
    }
  }
}

function deleteIndexedArticle(codename) {
  searchIndex.deleteBy({
    'codename': codename
  });
}

module.exports = async (context, event) => {
  validateEventGridEvent(context, event);

  if (event[0].subject && event[0].data) {
    const subject = event[0].subject;

    if (subject === 'initialize') {
      fetchAndIndexAllArticles();
    }

    if (event[0].data.items && (subject === 'publish' || subject === 'unpublish')) {
      const codenames = getCodenamesOfItems(event[0].data.items, 'article');
      fetchAndIndexArticlesFromKentico(codenames);
    }

    if (event[0].data.items && subject === 'ar chive') {
      const codenames = getCodenamesOfItems(event[0].data.items, 'article');
      deleteIndexedArticles(codenames);
    }
  } else {
    // handle invalid message
  }

  context.log('JavaScript queue trigger function processed work item', event);
};
