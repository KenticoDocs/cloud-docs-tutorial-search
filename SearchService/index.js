const kenticoClient = require('./external/kentico');
const searchIndex = require('./external/search');
const createIndexableArticle = require('./utils/indexableArticleCreator');
const getCodenamesOfItems = require('./utils/codenamesExtractor');
const validateEvent = require('./eventValidator');
const resolveItemInRichText = require('./utils/richTextResolver');

function indexAllArticles() {
  kenticoClient
    .items()
    .type('article')
    .queryConfig({
      richTextResolver: resolveItemInRichText
    })
    .getPromise()
    .then(response =>
      response.items.forEach(article => resolveAndIndexArticle(article)));
}

function indexSpecificArticles(codenames) {
  codenames.forEach(codename => fetchAndIndexArticle(codename));
}

function fetchAndIndexArticle(codename) {
  kenticoClient
    .item(codename)
    .queryConfig({
      richTextResolver: resolveItemInRichText
    })
    .getPromise()
    .then(response => resolveAndIndexArticle(response.item));
}

function resolveAndIndexArticle(article) {
  if (article.content) {
    const resolvedArticle = resolveItemsInRichText(article);
    indexArticle(resolvedArticle);
  }
}

function resolveItemsInRichText(article) {
  return {
    ...article,
    content: {
      value: article.content.getHtml()
    }
  }
}

function indexArticle(article) {
  const articleObject = createIndexableArticle(article);
  searchIndex.saveObjects(articleObject);
}

function deleteIndexedArticles(codenames) {
  codenames.map(codename => deleteIndexedArticle(codename));
}

function deleteIndexedArticle(codename) {
  searchIndex.deleteBy({
    filters: `codename:${codename}`
  });
}

module.exports = async (context, event) => {
  const parsedReq = validateEvent(context, event);

  if (parsedReq[0].subject && parsedReq[0].data) {
    const subject = parsedReq[0].subject;
    const items = parsedReq[0].data.items;

    if (subject === 'initialize') {
      searchIndex.clearIndex();
      indexAllArticles();
    }

    if (items && (subject === 'publish' || subject === 'unpublish')) {
      const codenames = getCodenamesOfItems(items, 'article');
      indexSpecificArticles(codenames);
    }

    if (items && subject === 'archive') {
      const codenames = getCodenamesOfItems(items, 'article');
      deleteIndexedArticles(codenames);
    }
  }
};
