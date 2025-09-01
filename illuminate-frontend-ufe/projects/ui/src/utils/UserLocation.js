import updatePreferredZipCode from 'services/api/profile/updatePreferredZipCode';
import utilityApi from 'services/api/utility';
import localeUtils from 'utils/LanguageLocale';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import { TIME_OUT } from 'constants/location';
import cookieUtils from 'utils/Cookies';
import RCPSCookies from 'utils/RCPSCookies';
import UserUtils from 'utils/User';

const UserLocation = {
    useBrowserGeoLocation: () => {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        const locationObj = {
                            lat: position.coords.latitude,
                            lon: position.coords.longitude
                        };
                        resolve(locationObj);
                    },
                    error => reject(error),
                    { timeout: TIME_OUT }
                );
            }
        });
    },

    updatePreferredZipCode: locationData => {
        const store = require('Store').default;
        const userActions = require('actions/UserActions').default;
        const isUserAnonymous = UserUtils.isAnonymous();
        const { isAnonProfileEnabled } = Sephora.configurationSettings;

        return new Promise((resolve, reject) => {
            updatePreferredZipCode(locationData)
                .then(data => {
                    if (data.zipCode) {
                        const updatedZipCodeData = {
                            preferredZipCode: data.zipCode,
                            encryptedStoreIds: data.encryptedStoreIds
                        };

                        if (!locationData.skipZipCodeUpdate) {
                            store.dispatch(userActions.update(updatedZipCodeData, false));

                            if (Sephora.configurationSettings.setZipStoreCookie) {
                                cookieUtils.write('sameDayZipcodeCookie', data.zipCode, null, false, false);
                            }

                            Storage.session.setItem(LOCAL_STORAGE.PREFERRED_ZIP_CODE, updatedZipCodeData);
                        } else if (isUserAnonymous && isAnonProfileEnabled) {
                            cookieUtils.write('sameDayZipcodeCookie', data.zipCode, null, false, false);
                        }

                        resolve(data);
                    } else {
                        reject(data);
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    initZipCode: () => {
        let parameters = { initZipCode: true };
        const isRCPSProfileBiGroupAPIEnabled = RCPSCookies.isRCPSProfileBiGroupAPIEnabled();
        const userPreferredZipCode = UserUtils.getZipCode();

        if (isRCPSProfileBiGroupAPIEnabled) {
            const postalCode = userPreferredZipCode || Storage.session.getItem(LOCAL_STORAGE.PREFERRED_ZIP_CODE)?.preferredZipCode;

            if (postalCode) {
                parameters = { ...parameters, postalCode };
            }
        }

        return updatePreferredZipCode(parameters);
    },

    updateZipCode: (data = {}) => {
        const { lat, lon, zipCode, postalCode } = data;

        const parameters = {};

        if (lat) {
            parameters.lat = lat;
            parameters.lon = lon;
        }

        if (zipCode) {
            parameters.postalCode = zipCode;
        }

        if (postalCode) {
            parameters.postalCode = postalCode;
        }

        return updatePreferredZipCode(parameters);
    },

    setPreferredZipCodeOnSession: (preferredZipCode, init) => {
        // If the user has a preferredZipCode, just send init
        // This is the path to set preferredZipcode:
        // https://confluence.sephora.com/wiki/pages/viewpage.action?spaceKey=DEF&title=Same+Day+FE+Walkthrough
        if (preferredZipCode && init) {
            return UserLocation.initZipCode();
        } else {
            // If not, use user's geolocation to get a lat and lon, update the zipcode
            // with that information and finally send init
            return UserLocation.useBrowserGeoLocation()
                .then(data => {
                    return UserLocation.updateZipCode(data);
                })
                .catch(error => {
                    // If the user doesn't allow geolocation
                    return (
                        utilityApi
                            .getLocation({ radius: localeUtils.getCountrySearchRadius() })
                            .then(locationData => {
                                const stores = locationData?.stores;
                                let postalCode;

                                if (stores) {
                                    postalCode = stores[0]?.address?.postalCode;
                                }

                                if (postalCode) {
                                    return UserLocation.updateZipCode({ postalCode });
                                } else {
                                    // If there are NO stores near the zipcode we got through Akamai
                                    return error;
                                }
                            })
                            // If unable to find location details
                            // eslint-disable-next-line no-console
                            .catch(errorInitZipCode => console.log(errorInitZipCode))
                    );
                });
        }
    }
};

export default UserLocation;
