import PageActionCreators from 'actions/framework/PageActionCreators';
import { SET_SHOP_SAME_DAY, SHOW_SDU_LANDING_PAGE_MODAL } from 'constants/actionTypes/happening';
import sdnApi from 'services/api/sdn';
import decorators from 'utils/decorators';
import addressUtils from 'utils/Address';
import sysUtils from 'utils/ShopYourStore';
import Actions from 'Actions';
import { LANDING_PAGE } from 'constants/ShopYourStore';

class ShopSameDayActionCreators extends PageActionCreators {
    isNewPage = () => true;

    updatePage = () => ({});

    setShopSameDay = payload => {
        return {
            type: SET_SHOP_SAME_DAY,
            payload
        };
    };

    showSDULandingPageModal = payload => {
        return {
            type: SHOW_SDU_LANDING_PAGE_MODAL,
            payload
        };
    };

    openPage = ({ events: { onPageUpdated, onDataLoaded, onError } }) => {
        return async (dispatch, getState) => {
            try {
                const { user } = getState();
                const biAccountId = user?.beautyInsiderAccount?.biAccountId;
                const profileId = user?.profileId;
                const zipCode = addressUtils.formatZipCode(user?.preferredZipCode);
                const payload = {
                    biAccountId,
                    profileId,
                    zipCode
                };

                let data = { isInitialized: false };

                if (payload.zipCode) {
                    data = await sdnApi.getShopSameDay(payload);
                }

                onDataLoaded(data);
                dispatch(this.setShopSameDay(data));
                sysUtils.updateCachedSLAInformation(LANDING_PAGE.ZIP_CODE_DETAILS, data?.data?.sameDay);
                onPageUpdated(data);

                return Promise.resolve();
            } catch (error) {
                onError(error);

                return Promise.reject(error);
            }
        };
    };

    fetchShopSameDay = () => {
        return async (dispatch, getState) => {
            try {
                const { user } = getState();
                const biAccountId = user?.beautyInsiderAccount?.biAccountId;
                const profileId = user?.profileId;
                const zipCode = addressUtils.formatZipCode(user?.preferredZipCode);
                const payload = {
                    biAccountId,
                    profileId,
                    zipCode
                };

                let data = { isInitialized: false };

                if (payload.zipCode) {
                    data = await decorators.withInterstice(sdnApi.getShopSameDay)(payload);
                }

                dispatch(this.setShopSameDay(data));
                sysUtils.updateCachedSLAInformation(LANDING_PAGE.ZIP_CODE_DETAILS, data?.data?.sameDay);

                return Promise.resolve();
            } catch (error) {
                return Promise.reject(error);
            }
        };
    };

    showShippingDeliveryLocationModal = (entry, isOpen = true) => {
        return dispatch => {
            dispatch(
                Actions.showShippingDeliveryLocationModal({
                    entry,
                    isOpen
                })
            );
        };
    };
}

const ShopSameDayActions = new ShopSameDayActionCreators();

export default ShopSameDayActions;
