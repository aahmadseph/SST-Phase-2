/* eslint-disable class-methods-use-this */

module.exports = (function () {
    const store = require('store/Store').default;
    const userActions = require('actions/UserActions').default;
    const Storage = require('utils/localStorage/Storage').default;
    const LOCAL_STORAGE = require('utils/localStorage/Constants').default;
    const Events = require('utils/framework/Events').default;
    const getLocation = require('services/api/utility/getLocation').default;
    const getStoreLocations = require('services/api/utility/storeLocator/getStoreLocations').default;
    const localeUtils = require('utils/LanguageLocale').default;
    const storeUtils = require('utils/Store').default;
    const defaultStore = {
        displayName: null,
        isDefault: true
    };
    const locationRadius = localeUtils.getCountrySearchRadius();
    const userLocationUtils = require('utils/UserLocation').default;
    const locationUtils = require('utils/Location').default;
    const profileApi = require('services/api/profile').default;
    const cookieUtils = require('utils/Cookies').default;
    const { DEFAULT_STORE_ID } = require('constants/defaultStoreZipCode').default;

    const updatePreferredStoreAndLocalStorage = function (preferredStore, profile) {
        storeUtils.cacheStoreData(preferredStore);
        store.dispatch(userActions.updatePreferredStore({ preferredStoreInfo: preferredStore }));

        if (Sephora.configurationSettings.setZipStoreCookie) {
            cookieUtils.write(
                cookieUtils.KEYS.PREFERRED_STORE,
                preferredStore.storeId || DEFAULT_STORE_ID[profile?.profileLocale],
                null,
                false,
                false
            );
        }
    };

    const updatePreferredZipcode = function () {
        const reduxState = store.getState();
        const user = reduxState.user;
        const userDataPreferredZipCode = user.preferredZipCode;
        const localStoragePreferredZipCode = Storage.session.getItem(LOCAL_STORAGE.PREFERRED_ZIP_CODE);

        if (localStoragePreferredZipCode) {
            store.dispatch(
                userActions.update(
                    {
                        encryptedStoreIds: null,
                        ...localStoragePreferredZipCode
                    },
                    false
                )
            );

            return;
        }

        // Make sure to update local storage zipcode if the user already has a preferred zipcode
        if (userDataPreferredZipCode) {
            Storage.session.setItem(LOCAL_STORAGE.PREFERRED_ZIP_CODE, { preferredZipCode: userDataPreferredZipCode });

            return;
        }

        if (!localStoragePreferredZipCode && !userDataPreferredZipCode) {
            userLocationUtils
                .setPreferredZipCodeOnSession()
                .then(zipCodeData => {
                    // We might have a successfull
                    if (zipCodeData.sameDayAvailable) {
                        const zipData = {
                            preferredZipCode: zipCodeData.zipCode,
                            encryptedStoreIds: zipCodeData.encryptedStoreIds
                        };
                        store.dispatch(userActions.update(zipData, false));
                        Storage.session.setItem(LOCAL_STORAGE.PREFERRED_ZIP_CODE, zipData);
                    } else {
                        // When the geolocated zip code turns out to not be SDD enabled,
                        // We need to add the empty properties into user store to notify
                        // to the storeIdAndZipCodeSelector that at least we tried to get
                        // this data.
                        store.dispatch(
                            userActions.update(
                                {
                                    preferredZipCode: null,
                                    encryptedStoreIds: null
                                },
                                false
                            )
                        );
                    }
                })
                .catch(() => {
                    // SameDay not available for user's location
                    store.dispatch(
                        userActions.update(
                            {
                                preferredZipCode: null,
                                encryptedStoreIds: null
                            },
                            false
                        )
                    );
                });
        }
    };

    if (!Sephora.isNodeRender && typeof window !== 'undefined' && !(locationUtils.isVendorLoginPage() || locationUtils.isVendorGenericLogin())) {
        Events.onLastLoadEvent(window, [Events.UserInfoReady], () => {
            store.setAndWatch(['auth.profileStatus'], null, () => {
                const reduxState = store.getState();
                const user = reduxState.user;
                const selectedStore = Storage.session.getItem(LOCAL_STORAGE.SELECTED_STORE);

                if (user.preferredStore) {
                    if (selectedStore && selectedStore.storeId === user.preferredStore) {
                        store.dispatch(userActions.updatePreferredStore({ preferredStoreInfo: selectedStore }));
                    } else {
                        getStoreLocations(user.preferredStore).then(data => {
                            updatePreferredStoreAndLocalStorage(data.stores[0], user.profile);
                            store.dispatch(userActions.storeChangedFromHeader());
                        });
                    }
                } else if (selectedStore && user.profileLocale === selectedStore?.address?.country) {
                    store.dispatch(userActions.updatePreferredStore({ preferredStoreInfo: selectedStore }));
                } else {
                    // Prevent any more location API calls if default store has been set (user is browsing from other country
                    if (!selectedStore?.isDefault) {
                        getLocation({ radius: locationRadius })
                            .then(data => {
                                const nearestStore = data.stores[0];
                                //Update the preferred store only when the locale matches else use default

                                if (user.profileLocale === nearestStore?.address?.country) {
                                    profileApi
                                        .switchPreferredStore(nearestStore.storeId, false)
                                        .finally(() => {
                                            updatePreferredStoreAndLocalStorage(nearestStore, user.profile);
                                        })
                                        .catch(() => {});
                                } else {
                                    updatePreferredStoreAndLocalStorage(defaultStore, user.profile);
                                }
                            })
                            .catch(() => {
                                updatePreferredStoreAndLocalStorage(defaultStore, user.profile);
                            });
                    } else {
                        store.dispatch(userActions.updatePreferredStore({ preferredStoreInfo: selectedStore }));
                    }
                }
            });

            updatePreferredZipcode();
        });
    }
}());
