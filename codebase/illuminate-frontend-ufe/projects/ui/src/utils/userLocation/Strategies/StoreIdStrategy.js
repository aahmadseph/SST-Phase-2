import LocationStrategy from './LocationStrategy';
import urlUtils from 'utils/Url';
import localeUtils from 'utils/LanguageLocale';
import storeLocator from 'services/api/utility/storeLocator';
import LOCATION from './../Constants';

const StoreIdStrategy = function () {};

StoreIdStrategy.prototype = new LocationStrategy();

StoreIdStrategy.prototype.determineLocationAndCall = function (callback, failure) {
    const urlParams = urlUtils.getParams();

    if (urlParams && urlParams.storeId) {
        const params = { excludeNonSephoraStores: true };
        storeLocator.getStoreLocations(urlParams.storeId, params).then(
            response => {
                if (response.responseStatus !== 200 || !response.stores || !response.stores[0]) {
                    throw new Error('Invalid store availabilities response.');
                }

                const foundStore = response.stores[0];

                const display = foundStore.address && foundStore.address.postalCode ? foundStore.address.postalCode : '';
                const locationObj = {
                    src: LOCATION.TYPES.URL_STORE_ID,
                    display: display,
                    lat: parseFloat(foundStore.latitude),
                    lon: parseFloat(foundStore.longitude)
                };

                if (foundStore.address && foundStore.address.country && localeUtils.isValidCountry(foundStore.address.country)) {
                    locationObj.country = foundStore.address.country;
                }

                callback(locationObj, [foundStore]);
            },
            () => {
                this.next.determineLocationAndCall(callback, failure);
            }
        );

        return;
    }

    this.next.determineLocationAndCall(callback, failure);
};

export default StoreIdStrategy;
