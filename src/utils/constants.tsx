const constants = {
    PERSON_SATURATION: 0.5,
    PERSON_LIGHTNESS: 0.4,
    PERSON_LIGHTNESS_BORDER: 0.5,
    DEFAULT_NAME: "Name",
    PEOPLE_COLLECTION: "people",
    UPDATE_DEBOUNCE_TIME: 500,
    HIDDEN_OPACITY: 0.3,
    HIDE_TEXT: "hide",
    UNHIDE_TEXT: "unhide",
    DELETE_TEXT: "delete",
    SHUFFLE_LENGTH: 20, // number of items to shuffle
    SHUFFLE_BASE_INTERVAL: 900, // simple linear scalar, lower values means faster shuffling
    SHUFFLE_SLOPE: 0.8, // lower values means the first delay is more similar to the last delay, high
    SHUFFLE_PAUSE: 0 // ms to wait after shuffle ended
}

export default constants
