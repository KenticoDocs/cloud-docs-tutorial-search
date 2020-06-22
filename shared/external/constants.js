const VALID_OPERATIONS = ['publish', 'upsert', 'restore_publish', 'unpublish', 'archive'];

const TERM_DEFINITION_CONTENT_TYPE = 'term_definition';
const RELEASE_NOTE_CONTENT_TYPE = 'release_note';

const ROOT_CONTENT_TYPES = ['article', 'scenario', TERM_DEFINITION_CONTENT_TYPE, RELEASE_NOTE_CONTENT_TYPE];
const ALL_CONTENT_TYPES = ROOT_CONTENT_TYPES.concat(['callout', 'content_chunk', 'code_sample', 'code_samples']);
const EXCLUDED_FROM_SEARCH = 'excluded_from_search';
const ALWAYS_INCLUDE_CONTENT_TYPES_IN_SEARCH = [TERM_DEFINITION_CONTENT_TYPE, RELEASE_NOTE_CONTENT_TYPE]

module.exports = {
    TERM_DEFINITION_CONTENT_TYPE,
    RELEASE_NOTE_CONTENT_TYPE,
    ALWAYS_INCLUDE_CONTENT_TYPES_IN_SEARCH,
    VALID_OPERATIONS,
    ROOT_CONTENT_TYPES,
    ALL_CONTENT_TYPES,
    EXCLUDED_FROM_SEARCH
};
