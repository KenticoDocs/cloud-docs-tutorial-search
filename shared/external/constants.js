const VALID_OPERATIONS = ['publish', 'upsert', 'restore_publish', 'unpublish', 'archive'];

const ROOT_CONTENT_TYPES = ['article', 'scenario'];
const ALL_CONTENT_TYPES = ROOT_CONTENT_TYPES.concat(['callout', 'content_chunk', 'code_sample', 'code_samples']);

module.exports = {
    VALID_OPERATIONS,
    ROOT_CONTENT_TYPES,
    ALL_CONTENT_TYPES,
};
