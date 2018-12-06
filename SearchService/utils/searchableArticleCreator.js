const removeMarkdown = require('remove-markdown');

function createSearchableArticleObject(article) {
  const splitContent = article.content.value.split("<h2>");
  const searchableArticle = [];

  const description = article.description && article.description.value;
  const contentType = article.contentType && article.contentType.value;
  const shortTitle = article.shortTitle && article.shortTitle.value;
  const title = article.title && article.title.value;
  const codename = article.system.codename;

  for (i = 0; i < splitContent.length; i++) {
    content = removeMarkdown(splitContent[i]);
    order = i;

    searchableArticle.push({
      content,
      description,
      contentType,
      shortTitle,
      title,
      codename: codename,
      order: ++order,
      objectID: codename + '_order_' + order,
    })
  }

  return searchableArticle;
}

module.exports = createSearchableArticleObject;