import profileApi from 'services/api/profile';
import utilityApi from 'services/api/utility';
import Actions from 'Actions';
import store from 'Store';
import addressConstants from 'constants/Address';

import analyticsAddress from 'analytics/bindingMethods/pages/myAccount/addressPageBindings';
import anaConsts from 'analytics/constants';
import addressUtils from 'utils/Address';
import userActions from './UserActions';
import Location from 'utils/Location';

const { updateLocalDefaultShippingAddressData } = addressUtils;
const SHIPPING_ADDRESS_TYPE = 'S';

export default {
    getSavedAddresses: function (profileId, successCallback) {
        return profileApi.getShippingAddresses(profileId).then(data => successCallback(data.addressList));
    },

    setDefaultAddress: function (addressId, profileId, successCallback) {
        return profileApi
            .setDefaultShippingAddress(addressId)
            .then(() => profileApi.getShippingAddresses(profileId))
            .then(data => successCallback(data.addressList));
    },

    updateDefaultShippingAddressData: function (addressList) {
        const isCheckout = Location.isCheckout();

        const defaultAddress = Array.isArray(addressList)
            ? addressList.find(address => address.isDefault && (isCheckout || address.typeCode === SHIPPING_ADDRESS_TYPE))
            : null;

        if (defaultAddress) {
            const { country: defaultSACountryCode, postalCode: defaultSAZipCode } = defaultAddress;

            // Update the default shipping address in local storage
            updateLocalDefaultShippingAddressData({
                defaultSACountryCode,
                defaultSAZipCode
            });

            // Update the default shipping address in the store
            store.dispatch(
                userActions.updateStoreDefaultShippingAddressData({
                    defaultSACountryCode,
                    defaultSAZipCode
                })
            );
        }
    },

    deleteAddress: function (addressId, profileId, successCallback, failureCallback) {
        profileApi.removeShippingAddress(profileId, addressId).then(successCallback).catch(failureCallback);
    },

    addNewAddress: function (addressData, successCallback, failureCallback) {
        profileApi.addShippingAddress(addressData).then(successCallback).catch(failureCallback);
    },

    updateAddress: function (addressData, successCallback, failureCallback) {
        return profileApi.updateShippingAddress(addressData).then(successCallback).catch(failureCallback);
    },

    getStateList: function (countryCode, successCallback) {
        utilityApi.getStateList(countryCode).then(successCallback);
    },

    getShippingCountriesList: function (successCallback) {
        utilityApi.getShippingCountryList().then(successCallback);
    },

    validateAddress: function (addressData, successCallbackObj = {}, cancelCallback, pageType = digitalData.page.category.pageType) {
        const {
            address1, address2 = '', state, city, postalCode, country
        } = addressData;

        const dataToSend = {
            // according to API address1 param should include address1 and address2
            address1: `${address1} ${address2}`.trim(),
            state,
            city,
            postalCode,
            country
        };

        return utilityApi
            .validateAddress(dataToSend)
            .then(data => {
                const { ADDRESS_VERIFICATION_TYPE, ADDRESS_VERIFICATION_LEVEL } = addressConstants;
                const recommendedAddress = data.matchedAddresses[0];
                const verificationType =
                    recommendedAddress.addressVerificationLevel === ADDRESS_VERIFICATION_LEVEL.POOR
                        ? ADDRESS_VERIFICATION_TYPE.UNVERIFIED
                        : ADDRESS_VERIFICATION_TYPE.RECOMMENDED;
                const isRecommended = verificationType === ADDRESS_VERIFICATION_TYPE.RECOMMENDED;
                const successCallback = successCallbackObj[verificationType];
                const pageDetail = isRecommended ? anaConsts.PAGE_DETAIL.SHIPPING_RECOMMENDED : anaConsts.PAGE_DETAIL.SHIPPING_UNVERIFIED;

                recommendedAddress.country = country;

                if (recommendedAddress.addressVerificationLevel === ADDRESS_VERIFICATION_LEVEL.GOOD) {
                    // Dont show modals and call success callback with entered address if verification level is good
                    successCallback(addressData);
                } else {
                    // show recommended address modal or unverified address modal based on verification level if NOT good
                    store.dispatch(
                        Actions.showAddressVerificationModal({
                            isOpen: true,
                            verificationType: verificationType,
                            currentAddress: addressData,
                            // include country in modal for displaying purposes because recommendedAddress doesn't have it
                            recommendedAddress: isRecommended && Object.assign({}, recommendedAddress, { country }),
                            successCallback: () => {
                                if (isRecommended) {
                                    successCallback(recommendedAddress);
                                    analyticsAddress.handleAnalyticCallback('recommended');
                                } else {
                                    successCallback();
                                }
                            },
                            cancelCallback: () => {
                                cancelCallback();
                                analyticsAddress.handleAnalyticCallback('entered');
                            }
                        })
                    );

                    analyticsAddress.handleAnalyticAsyncLoad(pageType, pageDetail);
                }
            })
            .catch(reason => {
                // show unverified address modal
                const { ADDRESS_VERIFICATION_TYPE } = addressConstants;
                const successCallback = successCallbackObj[ADDRESS_VERIFICATION_TYPE.UNVERIFIED];
                const pageDetail = anaConsts.PAGE_DETAIL.SHIPPING_UNVERIFIED;

                if (reason?.errorCode !== -1 || reason.key === 'util.address.loqate.validate.fail') {
                    // UTS-3792
                    store.dispatch(
                        Actions.showAddressVerificationModal({
                            isOpen: true,
                            verificationType: ADDRESS_VERIFICATION_TYPE.UNVERIFIED,
                            currentAddress: addressData,
                            successCallback,
                            cancelCallback: () => {
                                cancelCallback();
                                analyticsAddress.handleAnalyticCallback('entered');
                            }
                        })
                    );

                    if (pageType === anaConsts.PAGE_TYPES.CHECKOUT || pageType === anaConsts.PAGE_TYPES.REPLACEMENT_ORDER) {
                        analyticsAddress.handleAnalyticAsyncLoad(pageType, pageDetail);
                    }
                } else {
                    cancelCallback();
                }
            });
    }
};
