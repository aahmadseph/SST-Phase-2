import isFunction from 'utils/functions/isFunction';
import languageLocaleUtils from 'utils/LanguageLocale';
import locationUtils from 'utils/Location';
import scriptUtils from 'utils/LoadScripts';
import storeUtils from 'utils/Store';
import userLocation from 'utils/userLocation/UserLocation';
import userUtils from 'utils/User';

import defaultStoreZipCode from 'constants/defaultStoreZipCode';

const { getPreferredStoreId, getZipCodeOfPrefferedStore, getPreferredStoreInfo } = userUtils;
const { isEventsLandingPage } = locationUtils;
const { DEFAULT_STORE_ID, DEFAULT_ZIP_CODE } = defaultStoreZipCode;
const { isUS } = languageLocaleUtils;

const HappeningLocation = (callback, state = {}) => {
    const defaultStoreId = isUS() ? DEFAULT_STORE_ID.US : DEFAULT_STORE_ID.CA;
    const defaultZipCode = isUS() ? DEFAULT_ZIP_CODE.US : DEFAULT_ZIP_CODE.CA;

    const getPreferredValues = () => {
        const preferredStoreId = getPreferredStoreId() || state.storeId;
        const preferredZipCode = getZipCodeOfPrefferedStore() || state.storeZipCode;

        return { preferredStoreId, preferredZipCode };
    };

    const getStores = locationObj => {
        return storeUtils
            .getStores(locationObj)
            .then(storeItem => {
                const sephoraStores = storeItem.filter(item => item.storeType.toUpperCase() === 'SEPHORA');

                if (sephoraStores.length > 0) {
                    const { storeId, address } = sephoraStores[0];
                    const { postalCode } = address;

                    if (isFunction(callback)) {
                        // eslint-disable-next-line max-len
                        callback(storeId || preferredStoreId || defaultStoreId, postalCode || preferredZipCode || defaultZipCode, sephoraStores);
                    }
                }
            })
            .catch(() => {
                if (isFunction(callback)) {
                    callback(defaultStoreId, defaultZipCode, []);
                }
            });
    };

    const getUserLocation = () => {
        userLocation.determineLocation(locationObj => getStores(locationObj), null, {
            sequence: userLocation.getDefaultStrategiesSequence()
        });
    };

    const loadGoogleScript = () => {
        if (!window.google) {
            scriptUtils.loadScripts([scriptUtils.SCRIPTS.GOOGLE], getUserLocation);
        } else {
            getUserLocation();
        }
    };

    const preferredInfo = getPreferredStoreInfo();

    const { preferredStoreId, preferredZipCode } = getPreferredValues();

    if (preferredStoreId && preferredZipCode && preferredInfo.storeType === 'SEPHORA') {
        if (isEventsLandingPage()) {
            getStores({ lat: preferredInfo.latitude, lon: preferredInfo.longitude });

            return;
        } else {
            if (isFunction(callback)) {
                callback(preferredStoreId, preferredZipCode);

                return;
            }
        }
    }

    loadGoogleScript();
};

export default HappeningLocation;
