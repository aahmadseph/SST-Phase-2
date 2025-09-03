import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';

import LoveActions from 'actions/LoveActions';
import { myListsSelector } from 'selectors/page/myLists/myListsSelector';
import { userSelector } from 'selectors/user/userSelector';
import { lovesSelector } from 'selectors/loves/lovesSelector';
import SkuLoveDataSelector from 'selectors/loves/skuLoveData/skuLoveDataSelector';
import SkuLoveImageDataSelector from 'selectors/loves/skuLoveImageData/skuLoveImageDataSelector';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import store from 'store/Store';
import FrameworkUtils from 'utils/framework';
import { MAX_CUSTOM_LISTS } from 'constants/sharableList';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import myListsUtils from 'utils/MyLists';

const { wrapHOC } = FrameworkUtils;
const { getLocaleResourceFile, getTextFromResource } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/GlobalModals/MyListsModal/locales', 'MyListsModal');
const { skuLoveDataSelector } = SkuLoveDataSelector;
const { skuLoveImageDataSelector } = SkuLoveImageDataSelector;

const localization = createStructuredSelector({
    title: getTextFromResource(getText, 'title'),
    done: getTextFromResource(getText, 'done'),
    add: getTextFromResource(getText, 'add'),
    item: getTextFromResource(getText, 'item'),
    items: getTextFromResource(getText, 'items'),
    createNewList: getTextFromResource(getText, 'createNewList'),
    somethingWentWrong: getTextFromResource(getText, 'somethingWentWrong'),
    maxProductsSavedErrorMessage: getTextFromResource(getText, 'maxProductsSavedErrorMessage'),
    added: getTextFromResource(getText, 'added'),
    remove: getTextFromResource(getText, 'remove')
});

const fields = createSelector(
    myListsSelector,
    lovesSelector,
    userSelector,
    skuLoveDataSelector,
    skuLoveImageDataSelector,
    localization,
    (myLists, loves, user, skuLoveData, skuLoveImageData, textResources) => {
        const skuLoveListImageData = {
            ...skuLoveImageData,
            size: [36, 36]
        };
        const isPerfImprovementEnabled = myListsUtils.isPerfImprovementEnabled();
        const allLists = isPerfImprovementEnabled ? loves.allLovedListsSkuOnly : myLists;

        const isLoveListUpdated = loves.isLoveListUpdated;
        const isListLimitReached = Array.isArray(myLists?.allLoves) && myLists.allLoves.filter(l => !l.isDefault).length >= MAX_CUSTOM_LISTS;
        const imageDisplayFlag = {};
        allLists?.allLoves?.forEach(list => {
            const found = list.shoppingListItems.some(item => item.sku.skuId === skuLoveData.skuId && item.sku.productId === skuLoveData.productId);

            if (found) {
                imageDisplayFlag[list.shoppingListId] = true;
            }
        });

        return {
            myLists: allLists,
            user,
            skuLoveData,
            skuLoveListImageData,
            isListLimitReached,
            imageDisplayFlag,
            isLoveListUpdated,
            isPerfImprovementEnabled,
            localization: {
                ...textResources
            }
        };
    }
);

const functions = dispatch => ({
    showMyListsModal: isOpen => {
        const action = LoveActions.showMyListsModal(isOpen);
        dispatch(action);
    },
    setSkuLoveData: skuLoveData => {
        const action = LoveActions.setSkuLoveData(skuLoveData);
        dispatch(action);
    },
    getAllLists: ({ callback, force, options }) => {
        const data = LoveActions.getAllLists({ callback, force, options });

        store.dispatch(data);
    },
    getAllListsSkusOverview: ({ callback, force, options }) => {
        const data = LoveActions.getAllListsSkusOverview({ callback, force, options });

        store.dispatch(data);
    },
    addLove: (skuLoveData, onSuccess, onError) => {
        const action = LoveActions.addLove(skuLoveData, onSuccess, onError);
        dispatch(action);
    },
    removeLove: (skuId, onSuccess, onError, productId) => {
        const action = LoveActions.removeLove(skuId, onSuccess, onError, productId);
        dispatch(action);
    },
    addItemToSharableList: (productSkuData, onSuccess, onError) => {
        const action = LoveActions.addItemToSharableList(productSkuData, onSuccess, onError);
        dispatch(action);
    },
    removeItemFromSharableList: (productLoveData, onSuccess, onError) => {
        const action = LoveActions.removeItemFromSharableList(productLoveData, onSuccess, onError);
        dispatch(action);
    },
    getFlatLoveListSkusOverview: (isUpdateShoppingList, callback, refreshCache) => {
        const action = LoveActions.getFlatLoveListSkusOverview(isUpdateShoppingList, callback, refreshCache);
        dispatch(action);
    },
    getFlatLoveListSkusWithDetails: (callback, refreshCache, options) => {
        const action = LoveActions.getFlatLoveListSkusWithDetails({ callback, force: refreshCache, options });
        dispatch(action);
    },
    getShoppingListById: options => {
        return store.dispatch(LoveActions.getShoppingListById(options));
    },
    getLimitedLoveListItems: ({ callback, refreshCache, options }) => {
        const action = LoveActions.getLimitedLoveListItems({ callback, force: refreshCache, options });
        dispatch(action);
    },
    removeLimitedLoveListItems: async () => {
        await Storage.db.removeItem(LOCAL_STORAGE.LIMITED_LOVED_ITEMS);
    }
});

const withMyListsModalProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withMyListsModalProps
};
