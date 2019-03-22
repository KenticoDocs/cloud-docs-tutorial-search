const VALID_REINDEX_OPERATIONS = ['publish', 'upsert', 'restore_publish'];
const VALID_DELETE_OPERATIONS = ['unpublish', 'archive'];
const VALID_OPERATIONS = VALID_REINDEX_OPERATIONS.concat(VALID_DELETE_OPERATIONS);

const CONTENT_TYPES_TO_INDEX = ['article', 'scenario'];

module.exports = {
    VALID_REINDEX_OPERATIONS,
    VALID_DELETE_OPERATIONS,
    VALID_OPERATIONS,
    CONTENT_TYPES_TO_INDEX,
};
