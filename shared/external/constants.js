const VALID_REINDEX_OPERATIONS = ['publish', 'upsert', 'restore_publish'];
const VALID_DELETE_OPERATIONS = ['unpublish', 'archive'];
const VALID_OPERATIONS = VALID_REINDEX_OPERATIONS.concat(VALID_DELETE_OPERATIONS);

const ROOT_CONTENT_TYPES = ['article', 'scenario'];
const ALL_CONTENT_TYPES = ROOT_CONTENT_TYPES.concat(['callout', 'content_chunk', 'code_sample', 'code_samples']);

module.exports = {
    VALID_REINDEX_OPERATIONS,
    VALID_DELETE_OPERATIONS,
    VALID_OPERATIONS,
    ROOT_CONTENT_TYPES,
    ALL_CONTENT_TYPES
};
