import Storage from 'utils/localStorage/Storage';

const KEYS = { CUSTOM_SET_CHOICES: 'custom_sets_last_choices' };

const setCustomSetsChoices = function (choices, productId, sessionId) {
    Storage.local.setItem(KEYS.CUSTOM_SET_CHOICES, {
        productId,
        sessionId,
        choices
    });
};

const getCustomSetsChoices = function () {
    return Storage.local.getItem(KEYS.CUSTOM_SET_CHOICES);
};

const deleteCustomSetsChoices = function () {
    return Storage.local.removeItem(KEYS.CUSTOM_SET_CHOICES);
};

export default {
    KEYS,
    setCustomSetsChoices,
    getCustomSetsChoices,
    deleteCustomSetsChoices
};
