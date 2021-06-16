export const VALID_OPERATIONS = ['publish', 'upsert', 'restore_publish', 'unpublish', 'archive'];

export const TERM_DEFINITION_CONTENT_TYPE = 'term_definition';
export const RELEASE_NOTE_CONTENT_TYPE = 'release_note';
export const TRAINING_COURSE_CONTENT_TYPE = 'training_course';

export const ROOT_CONTENT_TYPES = [
    'article',
    'scenario',
    TERM_DEFINITION_CONTENT_TYPE,
    RELEASE_NOTE_CONTENT_TYPE,
    TRAINING_COURSE_CONTENT_TYPE
];
export const ALL_CONTENT_TYPES = ROOT_CONTENT_TYPES.concat(['callout', 'content_chunk', 'code_sample', 'code_samples']);
export const EXCLUDED_FROM_SEARCH = 'excluded_from_search';
export const ALWAYS_INCLUDE_CONTENT_TYPES_IN_SEARCH = [TERM_DEFINITION_CONTENT_TYPE, RELEASE_NOTE_CONTENT_TYPE];
