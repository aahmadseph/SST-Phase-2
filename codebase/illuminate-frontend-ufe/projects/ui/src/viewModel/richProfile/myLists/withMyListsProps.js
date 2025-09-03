import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import { createSelector, createStructuredSelector } from 'reselect';
import LoveActions from 'actions/LoveActions';
import userUtils from 'utils/User';
import { userSelector } from 'selectors/user/userSelector';
import { myListsSelector } from 'selectors/page/myLists/myListsSelector';
import LimitedLoveListItemsSelector from 'selectors/loves/limitedLoveListItems/limitedLoveListItemsSelector';
import { lovesSelector } from 'selectors/loves/lovesSelector';
import actions from 'actions/Actions';
import localeUtils from 'utils/LanguageLocale';
import store from 'store/Store';
import Actions from 'actions/Actions';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import Storage from 'utils/localStorage/Storage';

const { getTextFromResource, getLocaleResourceFile } = localeUtils;
const getText = getLocaleResourceFile('components/RichProfile/MyLists/locales', 'MyLists');

const { wrapHOC } = FrameworkUtils;
const { limitedLoveListItemsSelector } = LimitedLoveListItemsSelector;

const localization = createStructuredSelector({
    loves: getTextFromResource(getText, 'loves'),
    myLists: getTextFromResource(getText, 'myLists'),
    createNewList: getTextFromResource(getText, 'createNewList'),
    signIn: getTextFromResource(getText, 'signIn'),
    signInToView: getTextFromResource(getText, 'signInToView'),
    item: getTextFromResource(getText, 'item'),
    items: getTextFromResource(getText, 'items'),
    of: getTextFromResource(getText, 'of'),
    results: getTextFromResource(getText, 'results'),
    result: getTextFromResource(getText, 'result'),
    emptyLists: getTextFromResource(getText, 'emptyLists'),
    weThinkYouWillLove: getTextFromResource(getText, 'weThinkYouWillLove'),
    getTheseBeforeGone: getTextFromResource(getText, 'getTheseBeforeGone'),
    showMoreProducts: getTextFromResource(getText, 'showMoreProducts'),
    allSavedItems: getTextFromResource(getText, 'allSavedItems'),
    sortText: getTextFromResource(getText, 'sortText'),
    cancel: getTextFromResource(getText, 'cancel'),
    recentlyAdded: getTextFromResource(getText, 'recentlyAdded'),
    sale: getTextFromResource(getText, 'sale'),
    emptySaleFilter: getTextFromResource(getText, 'emptySaleFilter')
});

const fields = createSelector(
    myListsSelector,
    limitedLoveListItemsSelector,
    lovesSelector,
    userSelector,
    localization,
    (myLists, limitedLoveListItems, loves, user, textResources) => {
        const isUserAtleastRecognized = userUtils.isUserAtleastRecognized();
        const isUserReady = user.isInitialized;
        const allLovesFlatList = loves.currentLovesSkuDetails;

        // In case where there is only the defauly list item, adding a new one, with empty state for create list card
        if (myLists?.allLoves.length === 1 && !myLists.allLoves.find(list => list.isEmpty)) {
            myLists.allLoves.push({
                isCreateList: true, // Custom prop to know its empty card
                isDefault: false,
                profileLocale: 'US',
                profileStatus: 0,
                shareLink: '',
                shoppingListId: '',
                shoppingListItems: [],
                shoppingListItemsCount: 0,
                shoppingListName: '',
                shoppingListType: '',
                socialBadgeLogo: ''
            });
        }

        const isEmptyState =
            (myLists?.allLoves.length === 2 &&
                myLists?.allLoves.some(list => list.isDefault && list.shoppingListItemsCount === 0) &&
                myLists?.allLoves.some(list => list.isCreateList)) ||
            allLovesFlatList.length === 0;

        const totalLoadedProductsText = isEmptyState
            ? `0-0 ${textResources.of} 0 ${textResources.results}`
            : `${allLovesFlatList.length ? 1 : 0}-${allLovesFlatList.length} ${textResources.of} ${loves?.totalLovesListItemsCount} ${
                loves?.totalLovesListItemsCount === 1 ? textResources.result : textResources.results
            }`;

        const defaultLovesList = myLists?.allLoves.find(list => list.isDefault);
        const shouldCallToGetMoreLovesList = defaultLovesList?.shoppingListItemsCount > defaultLovesList?.shoppingListItems.length;

        const getLimitedLoveListCount = async () => {
            const result = await Storage.db.getItem(LOCAL_STORAGE.LIMITED_LOVED_ITEMS);

            return result;
        };

        return {
            myLists,
            limitedLoveListItems,
            allLovesFlatList,
            user,
            isUserAtleastRecognized,
            isUserReady,
            isEmptyState,
            totalLovesListItemsCount: loves.totalLovesListItemsCount,
            totalLoadedProductsText,
            shouldCallToGetMoreLovesList,
            getLimitedLoveListCount,
            localization: {
                ...textResources
            }
        };
    }
);

const functions = {
    addLove: LoveActions.addLove,
    removeLove: LoveActions.removeLove,
    showMyListsModal: LoveActions.showMyListsModal,
    getLimitedLoveListItems: ({ callback, refreshCache }) => {
        return store.dispatch(LoveActions.getLimitedLoveListItems({ callback, force: refreshCache }));
    },
    setSaleFilter: isSaleFilterEnabled => {
        return store.dispatch(LoveActions.setSaleFilter(isSaleFilterEnabled));
    },
    setSortByFilter: sortBy => {
        return store.dispatch(LoveActions.setSortByFilter(sortBy));
    },
    fetchData: ({ force = false, options = {} }) => {
        return store.dispatch(
            LoveActions.getAllLists({
                force,
                options,
                callback: () => {
                    const title = getText('myLists');
                    const message = getText('somethingWentWrong');
                    const buttonText = getText('gotIt');

                    store.dispatch(
                        Actions.showInfoModal({
                            isOpen: true,
                            title: title,
                            message: message,
                            buttonText: buttonText,
                            showCloseButton: true
                        })
                    );
                }
            })
        );
    },
    showSignInModal: () => store.dispatch(actions.showSignInModal({ isOpen: true })),
    fetchAllLovedItems: ({ force = false, options = {}, callback }) => {
        return store.dispatch(LoveActions.getFlatLoveListSkusWithDetails({ force, options, callback }));
    }
};

const withMyListsProps = wrapHOC(connect(fields, functions));

export {
    withMyListsProps, fields, functions
};
