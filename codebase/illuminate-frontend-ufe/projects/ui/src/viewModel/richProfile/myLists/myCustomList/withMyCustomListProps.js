/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import { createSelector, createStructuredSelector } from 'reselect';
import LoveActions from 'actions/LoveActions';
import userUtils from 'utils/User';
import { userSelector } from 'selectors/user/userSelector';
import { myCustomListSelector } from 'selectors/page/myLists/myCustomList/myCustomListSelector';
import LoveListNameSelector from 'selectors/loves/loveListName/loveListNameSelector';
import actions from 'actions/Actions';
import localeUtils from 'utils/LanguageLocale';
import locationUtils from 'utils/Location';
import store from 'store/Store';
import HelperUtils from 'utils/Helpers';
const { getTextFromResource, getLocaleResourceFile } = localeUtils;
const getText = getLocaleResourceFile('components/RichProfile/MyLists/MyCustomList/locales', 'MyCustomList');

const { wrapHOC } = FrameworkUtils;
const { loveListNameSelector } = LoveListNameSelector;

const localization = createStructuredSelector({
    myLists: getTextFromResource(getText, 'myLists'),
    signIn: getTextFromResource(getText, 'signIn'),
    signInToView: getTextFromResource(getText, 'signInToView'),
    item: getTextFromResource(getText, 'item'),
    items: getTextFromResource(getText, 'items'),
    weThinkYouWillLove: getTextFromResource(getText, 'weThinkYouWillLove'),
    getTheseBeforeGone: getTextFromResource(getText, 'getTheseBeforeGone'),
    edit: getTextFromResource(getText, 'edit'),
    yourListIsEmpty: getTextFromResource(getText, 'yourListIsEmpty'),
    browseProducts: getTextFromResource(getText, 'browseProducts'),
    share: getTextFromResource(getText, 'share'),
    of: getTextFromResource(getText, 'of'),
    results: getTextFromResource(getText, 'results'),
    result: getTextFromResource(getText, 'result'),
    showMoreProducts: getTextFromResource(getText, 'showMoreProducts'),
    rouge: getTextFromResource(getText, 'rouge'),
    sharedList: getTextFromResource(getText, 'sharedList'),
    sharedListIsEmpty: getTextFromResource(getText, 'sharedListIsEmpty'),
    sortText: getTextFromResource(getText, 'sortText'),
    cancel: getTextFromResource(getText, 'cancel')
});

const fields = createSelector(
    myCustomListSelector,
    loveListNameSelector,
    userSelector,
    localization,
    (myCustomList, loveListName, user, textResources) => {
        const isUserAtleastRecognized = userUtils.isUserAtleastRecognized();
        const isUserReady = user.isInitialized;
        const sharedListToken = locationUtils.getSharedListToken();
        const decodedOwnersFirstName = sharedListToken ? locationUtils.getFirstNameFromSharedListToken() : '';
        const ownerListName = sharedListToken && decodedOwnersFirstName ? `${decodedOwnersFirstName}'s ${textResources.sharedList}` : '';
        const itemCountText = `${myCustomList?.shoppingListItemsCount || 0} ${
            myCustomList?.shoppingListItemsCount === 1 ? textResources.item : textResources.items
        }`;

        const emptyMessage = myCustomList.isSharedList ? textResources.sharedListIsEmpty : textResources.yourListIsEmpty;
        const shoppingListItems = myCustomList?.shoppingListItems.map(item => {
            return {
                ...item,
                sku: {
                    ...item.sku,
                    starRatings: item?.sku?.primaryProduct?.ratings || 0,
                    productReviewCount: item?.sku?.primaryProduct?.reviews || 0
                }
            };
        });

        const shouldShowSignIn = !isUserAtleastRecognized && !sharedListToken;
        const shouldShowEditLink = !myCustomList.isDefault && !myCustomList.isSharedList;
        const shouldShowShareLink = !myCustomList.isSharedList;
        const shouldShowContent = (isUserAtleastRecognized && myCustomList.isInitialized) || myCustomList.isSharedList;
        const shouldDisplayShowMoreProducts = shoppingListItems.length < myCustomList.shoppingListItemsCount;

        const totalLoadedProducts = `1-${shoppingListItems.length} ${textResources.of} ${myCustomList?.shoppingListItemsCount} ${
            myCustomList?.shoppingListItemsCount === 1 ? textResources.result : textResources.results
        }`;
        const lovedListName = loveListName || myCustomList.shoppingListName || '';
        const lovedListNameBreadCrumbs = HelperUtils.truncateGraphemes({
            text: lovedListName.replace(/\n/g, ' '),
            maxTextLength: 20,
            truncationMarker: '...'
        });
        const encodedFirstName = btoa(user?.beautyInsiderAccount?.firstName || '');

        return {
            myCustomList,
            sharedListToken,
            user,
            isUserReady,
            shoppingListItems,
            shouldShowSignIn,
            shouldShowEditLink,
            shouldShowShareLink,
            shouldShowContent,
            shouldDisplayShowMoreProducts,
            lovedListName,
            lovedListNameBreadCrumbs,
            encodedFirstName,
            localization: {
                ownerListName,
                itemCountText,
                totalLoadedProducts,
                emptyMessage,
                ...textResources
            }
        };
    }
);

const functions = {
    fetchData: options => {
        return store.dispatch(LoveActions.getShoppingListById(options));
    },
    showSignInModal: () => store.dispatch(actions.showSignInModal({ isOpen: true })),
    setSortByFilter: sortBy => {
        return store.dispatch(LoveActions.setSortByFilter(sortBy));
    }
};

const withMyCustomListProps = wrapHOC(connect(fields, functions));

export {
    withMyCustomListProps, fields, functions
};
