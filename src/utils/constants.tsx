const constants = {
    PERSON_SATURATION: 0.5,
    PERSON_LIGHTNESS: 0.4,
    PERSON_LIGHTNESS_BORDER: 0.5,
    DEFAULT_NAME: "Name",
    PEOPLE_COLLECTION: "people",
    UPDATE_DEBOUNCE_TIME: 300,
    HIDDEN_OPACITY: 0.3,
    HIDE_TEXT: "hide",
    UNHIDE_TEXT: "unhide",
    DELETE_TEXT: "delete",
    SHUFFLE_LENGTH: 20, // number of items to shuffle
    SHUFFLE_BASE_INTERVAL: 300, // simple linear scalar, lower values means faster shuffling
    SHUFFLE_SLOPE: 0.7, // lower values means the first delay is more similar to the last delay
    SHUFFLE_PAUSE: 0, // ms to wait after shuffle ended
    INIT_ANIMATION_TIME: 100
}

export default constants
