import PageActionCreators from 'actions/framework/PageActionCreators';
import {
    SET_SHOP_MY_STORE,
    SET_SHOP_MY_STORE_SALE_ITEMS,
    SET_SHOP_SAME_DAY_SALE_ITEMS,
    SET_STORE_AND_DELIVERY_SLA
} from 'constants/actionTypes/happening';
import sdnApi from 'services/api/sdn';
import { getProductsFromKeyword } from 'services/api/search-n-browse/searchProductsByKeyword';
import sysUtils from 'utils/ShopYourStore';
import addressUtils from 'utils/Address';
import decorators from 'utils/decorators';
import Actions from 'Actions';
import ConstructorRecsActions from 'actions/ConstructorRecsActions';
import PageTemplateType from 'constants/PageTemplateType';
import { CONSTRUCTOR_PODS } from 'constants/constructorConstants';
import { PICKUP, SAME_DAY } from 'constants/UpperFunnel';
import { LANDING_PAGE } from 'constants/ShopYourStore';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import Storage from 'utils/localStorage/Storage';

const { StorageTypes } = Storage;
const { SHOP_STORE_AND_DELIVERY_FLYOUT } = LOCAL_STORAGE;
const MAX_ITEMS_FOR_RECAP_PRODUCT_LIST = 4;

class ShopMyStoreActionCreators extends PageActionCreators {
    isNewPage = () => true;

    updatePage = () => ({});

    setShopMyStore = payload => {
        return {
            type: SET_SHOP_MY_STORE,
            payload
        };
    };

    openPage = ({ events: { onPageUpdated, onDataLoaded, onError } }) => {
        return async (dispatch, getState) => {
            try {
                const { user } = getState();
                const biAccountId = user?.beautyInsiderAccount?.biAccountId;
                const profileId = user?.profileId;
                const storeId = user?.preferredStore;
                const payload = {
                    biAccountId,
                    profileId,
                    storeId
                };

                let data = { isInitialized: false };

                if (payload.storeId) {
                    data = await sdnApi.getShopMyStore(payload);
                }

                onDataLoaded(data);
                dispatch(this.setShopMyStore(data));
                sysUtils.updateCachedSLAInformation(LANDING_PAGE.STORE_DETAILS, data?.data?.storeDetails);
                onPageUpdated(data);

                return Promise.resolve();
            } catch (error) {
                onError(error);

                return Promise.reject(error);
            }
        };
    };

    fetchShopMyStore = () => {
        return async (dispatch, getState) => {
            try {
                const { user } = getState();
                const biAccountId = user?.beautyInsiderAccount?.biAccountId;
                const profileId = user?.profileId;
                const storeId = user?.preferredStore;
                const payload = {
                    biAccountId,
                    profileId,
                    storeId
                };

                let data = { isInitialized: false };

                if (payload.storeId) {
                    data = await decorators.withInterstice(sdnApi.getShopMyStore)(payload);
                }

                dispatch(this.setShopMyStore(data));
                sysUtils.updateCachedSLAInformation(LANDING_PAGE.STORE_DETAILS, data?.data?.storeDetails);

                return Promise.resolve();
            } catch (error) {
                return Promise.reject(error);
            }
        };
    };

    showStoreSwitcherModal = (entry, callback) => {
        return dispatch => {
            dispatch(
                Actions.showStoreSwitcherModal({
                    isOpen: true,
                    entry,
                    showStoreDetails: true,
                    afterCallback: callback
                })
            );
        };
    };

    fetchConstructorData = (podId, isCollection) => {
        return (dispatch, getState) => {
            const { page } = getState();
            const template = page?.templateInformation?.template;
            let stores = [];

            if (template === PageTemplateType.ShopMyStore) {
                const storeId = page?.shopMyStore?.data?.storeDetails?.storeId;

                if (storeId) {
                    stores = [storeId];
                }
            } else if (template === PageTemplateType.ShopSameDay) {
                const storeIds = page?.shopSameDay?.data?.sameDay?.storeIds;

                if (storeIds) {
                    stores = storeIds;
                }
            }

            const availability = stores.map(storeId => 'store_' + storeId);

            const payload = {
                podId,
                isCollection,
                params: {
                    numResults: MAX_ITEMS_FOR_RECAP_PRODUCT_LIST,
                    filters: {
                        group_id: 'all', // eslint-disable-line camelcase
                        availability,
                        isOnlineOnly: false
                    }
                }
            };

            dispatch(ConstructorRecsActions.updateRequestData(payload));
        };
    };

    fetchBestsellers = () => {
        const podId = CONSTRUCTOR_PODS.BESTSELLERS_ALL;

        return this.fetchConstructorData(podId);
    };

    fetchJustArrived = () => {
        const podId = CONSTRUCTOR_PODS.NEW_CONTENT_ALL;

        return this.fetchConstructorData(podId, true);
    };
    fetchSale = () => {
        return async (dispatch, getState) => {
            const { page } = getState();
            const template = page?.templateInformation?.template;

            let actionType = '';
            let apiPayload = {
                q: 'sale',
                pageSize: MAX_ITEMS_FOR_RECAP_PRODUCT_LIST
            };

            if (template === PageTemplateType.ShopMyStore) {
                const storeId = page?.shopMyStore?.data?.storeDetails?.storeId;
                actionType = SET_SHOP_MY_STORE_SALE_ITEMS;
                apiPayload = {
                    ...apiPayload,
                    ref: [`${PICKUP}=${storeId}`],
                    pickupStoreId: storeId
                };
            } else if (template === PageTemplateType.ShopSameDay) {
                const zipCode = page?.shopSameDay?.data?.sameDay?.zipCode;
                actionType = SET_SHOP_SAME_DAY_SALE_ITEMS;
                apiPayload = {
                    ...apiPayload,
                    ref: [`${SAME_DAY}=${zipCode}`],
                    sddZipcode: zipCode
                };
            }

            let payload = {
                isLoading: false
            };

            try {
                dispatch({
                    type: actionType,
                    payload: { isLoading: true }
                });

                const response = await getProductsFromKeyword(apiPayload);
                payload = {
                    ...payload,
                    products: response.products
                };
            } finally {
                dispatch({
                    type: actionType,
                    payload
                });
            }
        };
    };

    fetchStoreAndDeliverySLA = async (invalidateCache = false) => {
        return async (dispatch, getState) => {
            const { user } = getState();
            const biAccountId = user?.beautyInsiderAccount?.biAccountId;
            const profileId = user?.profileId;
            const storeId = user?.preferredStore;
            const zipCode = addressUtils.formatZipCode(user?.preferredZipCode);
            const payload = { biAccountId, profileId, storeId, zipCode };
            let data = { isInitialized: false };

            if (payload.storeId || payload.zipCode) {
                const config = {
                    cache: {
                        key: SHOP_STORE_AND_DELIVERY_FLYOUT,
                        expiry: Storage.MINUTES * 15,
                        storageType: StorageTypes.Session,
                        invalidate: invalidateCache
                    }
                };

                data = await sdnApi.getShopStoreAndDeliverySLA(payload, config);
            }

            return dispatch({
                type: SET_STORE_AND_DELIVERY_SLA,
                payload: data
            });
        };
    };
}

const ShopMyStoreActions = new ShopMyStoreActionCreators();

export default ShopMyStoreActions;
