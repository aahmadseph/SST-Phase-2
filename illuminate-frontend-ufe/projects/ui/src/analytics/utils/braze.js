import store from 'Store';
import Storage from 'utils/localStorage/Storage';

// prettier-ignore
const INITIAL_DATA_BRAZE = {
    'user_id': ''
};

if (!Sephora.isNodeRender) {
    // If we haven't already cached the data, cache it
    if (Storage.session.getItem && Storage.session.getItem('lastDataForBraze') === null) {
        Storage.session.setItem('lastDataForBraze', JSON.stringify(INITIAL_DATA_BRAZE));
    }
}

const isNewData = function (key, value) {
    const cachedData = Storage.session.getItem('lastDataForBraze');

    if (!cachedData) {
        // If no data is cached, we need to initialize the cache again
        Storage.session.setItem('lastDataForBraze', JSON.stringify(INITIAL_DATA_BRAZE));

        return false;
    } else {
        const jsonCachedData = JSON.parse(cachedData);

        if (jsonCachedData[key] !== value) {
            return true;
        }

        return false;
    }
};

// Sets only updated data in storage so redundant values are not sent to Braze
const setNewData = function (key, value) {
    if (Sephora.isNodeRender) {
        return true;
    }

    if (isNewData(key, value)) {
        const cachedData = Storage.session.getItem('lastDataForBraze');
        const jsonCachedData = JSON.parse(cachedData);
        jsonCachedData[key] = value;
        const stringCachedData = JSON.stringify(jsonCachedData);
        Storage.session.setItem('lastDataForBraze', stringCachedData);

        return true;
    }

    return false;
};

const setBrazeUserData = function () {
    if (global.braze) {
        const { profileId } = store.getState().user;

        if (profileId) {
            braze.changeUser(profileId);
        }
    }
};

export default {
    setNewData,
    setBrazeUserData
};
