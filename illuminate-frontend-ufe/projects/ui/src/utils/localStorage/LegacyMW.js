import localStorageConstants from 'utils/localStorage/Constants';

const { LEGACY_MW_JSTORAGE } = localStorageConstants;

function getLegacyJStorage() {
    const jStorage = window.localStorage.getItem(LEGACY_MW_JSTORAGE) || '{}';

    return JSON.parse(jStorage);
}

module.exports = (function () {
    return {
        getLegacyJStorageItem: function (key) {
            const jStorage = getLegacyJStorage();

            return jStorage[key];
        },

        setLegacyJStorageItem: function (key, value) {
            const jStorage = getLegacyJStorage();
            jStorage[key] = value;
            window.localStorage.setItem(LEGACY_MW_JSTORAGE, JSON.stringify(jStorage));
        },

        deleteLegacyJStorageItem: function (key) {
            const jStorage = getLegacyJStorage();

            if (jStorage[key]) {
                delete jStorage[key];
            }

            window.localStorage.setItem(LEGACY_MW_JSTORAGE, JSON.stringify(jStorage));
        }
    };
}());
