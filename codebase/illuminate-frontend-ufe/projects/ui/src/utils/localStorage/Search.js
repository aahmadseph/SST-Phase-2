import Storage from 'utils/localStorage/Storage';

const KEYS = {
    STORAGE_PREVIOUS_RESULTS: 'search_previous_results',
    MIN_KEYWORD_LENGTH_FOR_SUGGESTIONS: 3,
    MAX_PREVIOUS_RESULTS_COUNT: 5
};

const setSearchTermStorageItem = function (term) {
    let data = Storage.local.getItem(KEYS.STORAGE_PREVIOUS_RESULTS);
    const lowerCaseTerm = term.toLowerCase();

    if (data) {
        if (!data.filter(result => result.term === lowerCaseTerm).length) {
            data.unshift({ term: lowerCaseTerm });
        }
    } else {
        data = [{ term: lowerCaseTerm }];
    }

    Storage.local.setItem(KEYS.STORAGE_PREVIOUS_RESULTS, data.slice(0, KEYS.MAX_PREVIOUS_RESULTS_COUNT));
};

const isPreviousSearchItem = function (term) {
    const data = Storage.local.getItem(KEYS.STORAGE_PREVIOUS_RESULTS);

    if (data && data.filter(result => result.term === (term || '').toLowerCase()).length) {
        return true;
    }

    return false;
};

export default {
    KEYS: KEYS,
    setSearchTermStorageItem: setSearchTermStorageItem,
    isPreviousSearchItem: isPreviousSearchItem
};
