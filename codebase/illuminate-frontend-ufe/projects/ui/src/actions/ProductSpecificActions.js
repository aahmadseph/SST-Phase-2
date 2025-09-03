import productSpecificDetails from 'reducers/productSpecificDetails';
const { ACTION_TYPES } = productSpecificDetails;
import decorators from 'utils/decorators';
import profileApi from 'services/api/profile';
import { INTERSTICE_DELAY_MS } from 'components/Checkout/constants';

function isSDDNotAvailableInZipCode(error) {
    return (error?.errorCode === -1 && error?.errors?.invalidInput) || error?.errors?.ZipcodeException;
}

function getZipcodeFromErrorMessage(error) {
    // Invalid input error gives us the zipcode, ZipcodeException DOES NOT
    const invalidInput = error?.errors?.invalidInput;

    const messageWords = invalidInput ? (invalidInput[0] || '').split(' ') : '';
    const zipCode = messageWords[messageWords.length - 1];
    error.sddNotAvailableForZipCode = true;
    error.notAvailableZipCode = zipCode;
}

function fetchProductSpecificDetails(userId, item, options = {}) {
    const defaultOptions = {
        fetchPickup: Sephora.configurationSettings.isBOPISEnabled,
        fetchSameDay: Sephora.configurationSettings.isSameDayShippingEnabled
    };

    return dispatch => {
        const { fetchPickup, fetchSameDay } = {
            ...defaultOptions,
            ...options
        };
        const getPickupProductDetails = fetchPickup
            ? decorators
                .withInterstice(profileApi.getRopisSpecificProductDetails, INTERSTICE_DELAY_MS)(
                    userId,
                    item.sku.productId,
                    item.sku.skuId,
                    'basket'
                )
                .catch(error => {
                    return error;
                })
            : Promise.resolve(null);

        const getSDDProductDetails = fetchSameDay
            ? decorators
                .withInterstice(profileApi.getSameDaySpecificProductDetails, INTERSTICE_DELAY_MS)(
                    userId,
                    item.sku.productId,
                    item.sku.skuId,
                    'basket'
                )
                .catch(error => {
                    if (error?.errorCode === 404 || error?.errors?.serviceException) {
                        error.sddTemporarilyUnavailable = true;
                    } else if (isSDDNotAvailableInZipCode(error)) {
                        getZipcodeFromErrorMessage(error);
                    }

                    return error;
                })
            : Promise.resolve(null);

        return Promise.all([getPickupProductDetails, getSDDProductDetails]).then(data => {
            dispatch({
                type: ACTION_TYPES.UPDATE_PRODUCT_SPECIFIC_DETAILS,
                item,
                data
            });
        });
    };
}

export default { fetchProductSpecificDetails };
