import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import analyticsUtils from 'analytics/utils';
import { breakpoints } from 'style/config';
import locationUtils from 'utils/Location';

const { LINK_TRACKING_EVENT, ASYNC_PAGE_LOAD, PRODUCT_STRING_TEMPLATE } = anaConsts;
const { MY_LISTS, MY_LIST } = anaConsts.PAGE_DETAIL;
const { LOVES } = anaConsts.EVENT_NAMES;
const { USER_PROFILE, MY_LISTS_FLYOUT } = anaConsts.PAGE_TYPES;
const { TOP_NAV, ACCOUNT, LOVES_ICON, MY_LISTS: MY_LISTS_NAV } = anaConsts.NAV_PATH;

class MyListsBindings {
    static triggerLinkAnalytics = eventData => {
        processEvent.process(LINK_TRACKING_EVENT, { data: eventData });
    };

    static triggerAsyncPageLoadAnalytics = eventData => {
        processEvent.process(ASYNC_PAGE_LOAD, { data: eventData });
    };

    static pageLoad = ({ pageType, eventName }) => {
        MyListsBindings.triggerAsyncPageLoadAnalytics({
            pageName: `${pageType}:${MY_LISTS}:${eventName}:*`
        });
    };

    static deleteList = () => {
        MyListsBindings.triggerLinkAnalytics({
            pageName: `${USER_PROFILE}:${MY_LIST}:n/a:*`,
            actionInfo: `${MY_LISTS}:${LOVES.DELETE_LIST}`
        });
    };

    static buildProductString = ({ skuId }) => PRODUCT_STRING_TEMPLATE.replace(/{sku}/g, skuId);

    static pageLoadMyListModal = ({ pageType, eventName }) => {
        MyListsBindings.triggerAsyncPageLoadAnalytics({
            pageName: `${pageType}:${MY_LIST}:${eventName}:*`
        });
    };

    static addToLove = ({ skuId }) => {
        MyListsBindings.triggerLinkAnalytics({
            pageName: `${USER_PROFILE}:${MY_LIST}:${LOVES.MY_LISTS_MODAL}:*`,
            eventStrings: [anaConsts.Event.EVENT_27],
            productStrings: MyListsBindings.buildProductString({ skuId })
        });
    };

    static removeFromLove = ({ skuId }) => {
        MyListsBindings.triggerLinkAnalytics({
            eventStrings: [anaConsts.Event.EVENT_28],
            productStrings: MyListsBindings.buildProductString({ skuId })
        });
    };

    static addToList = ({ skuId }) => {
        MyListsBindings.triggerLinkAnalytics({
            eventStrings: [anaConsts.Event.ADD_TO_LIST],
            productStrings: MyListsBindings.buildProductString({ skuId })
        });
    };

    static removeFromList = ({ skuId }) => {
        MyListsBindings.triggerLinkAnalytics({
            eventStrings: [anaConsts.Event.REMOVE_FROM_LIST],
            productStrings: MyListsBindings.buildProductString({ skuId })
        });
    };

    static triggerErrorAnalytics = ({ errorMessage }) => {
        MyListsBindings.triggerLinkAnalytics({
            fieldErrors: ['list'], //prop28
            errorMessages: errorMessage //prop48
        });
    };

    static formatShareableLists = (lists = []) => {
        if (!Array.isArray(lists) || lists.length === 0) {
            return null;
        }

        const summary = {
            shoppingListItemsCount: [],
            shoppingListName: [],
            isDefault: [],
            shoppingListId: [],
            skuIds: [],
            lists: lists,
            listsCount: lists.length
        };

        for (const list of lists) {
            summary.shoppingListItemsCount.push(list.shoppingListItemsCount ?? 0);
            summary.shoppingListName.push(list.shoppingListName ?? '');
            summary.isDefault.push(list.isDefault ?? false);
            summary.shoppingListId.push(list.shoppingListId ?? '');

            const skuIdList = (list.shoppingListItems ?? []).map(item => item?.sku?.skuId).filter(Boolean);

            if (skuIdList.length > 0) {
                summary.skuIds.push(skuIdList.join(';'));
            }
        }

        return {
            shoppingListItemsCount: summary.shoppingListItemsCount.join(';'),
            shoppingListName: summary.shoppingListName.join(';'),
            isDefault: summary.isDefault.join(';'),
            shoppingListId: summary.shoppingListId.join(';'),
            skuIds: summary.skuIds.join(';'),
            listsCount: summary.listsCount,
            lists: summary.lists
        };
    };

    // Trigger STAG page load event for shareable lists
    static stagShareableListPageLoadEvent = (myLists = {}) => {
        if (myLists && Object.keys(myLists).length === 0) {
            return;
        }

        const targetId = window?.location?.pathname.split('/').pop();
        const allLoves = myLists?.allLoves ? myLists.allLoves : [myLists] || [];
        let customList = [];

        if (targetId && targetId !== 'Lists') {
            // Filter for the specific list ID
            customList = allLoves.filter(list => list.shoppingListId === targetId);
        } else {
            customList = [...allLoves];
        }

        if (customList.length > 0) {
            const shareableData = MyListsBindings.formatShareableLists(customList);

            if (shareableData) {
                digitalData.page.shareableList = {
                    ...(digitalData.page.shareableList || {}),
                    ...shareableData
                };
            }

            digitalData.page.category.pageType = USER_PROFILE;
            const pageDetail = LOVES.LIST_DETAIL_PAGE_NAME;
            digitalData.page.pageInfo.pageName = locationUtils.isMyCustomListPage() ? pageDetail : MY_LISTS;
        }
    };

    // Set where the user is right now as navigationInfo so that
    // we can use it in the next page load as eVar64
    static setNextPageLoadAnalyticsData = (...args) => {
        const navigationInfo = analyticsUtils.buildNavPath([...args]);
        analyticsUtils.setNextPageData({ navigationInfo });
    };

    static setFlyoutNextPage = () => {
        MyListsBindings.setNextPageLoadAnalyticsData(TOP_NAV, ACCOUNT, MY_LISTS_NAV, MY_LISTS_NAV, MY_LISTS_NAV);
    };

    static setLoveIconNextPage = () => {
        MyListsBindings.setNextPageLoadAnalyticsData(TOP_NAV, LOVES_ICON, LOVES_ICON, LOVES_ICON, LOVES_ICON);
    };

    static heartClick = () => {
        const smallViewport = !window.matchMedia(breakpoints.smMin).matches;
        const pageType = USER_PROFILE;
        const pageDetail = MY_LISTS_FLYOUT;
        const pageSection = MY_LISTS;

        if (smallViewport) {
            MyListsBindings.setFlyoutNextPage();

            const pageName = `${pageType}:${pageSection}:${pageDetail}:*`;
            const previousPageName = digitalData.page.attributes.sephoraPageInfo.pageName;
            MyListsBindings.triggerAsyncPageLoadAnalytics({
                pageName,
                pageType,
                pageDetail,
                previousPageName
            });
        } else {
            MyListsBindings.setLoveIconNextPage();
        }
    };

    static createNewListModalPageLoad = () => {
        MyListsBindings.pageLoad({
            pageType: USER_PROFILE,
            eventName: LOVES.CREATE_NEW_LIST_PAGE_LOAD
        });
    };

    static limitReached = () => {
        MyListsBindings.pageLoad({
            pageType: USER_PROFILE,
            eventName: LOVES.LIST_LIMIT_REACHED
        });
    };

    static createListSuccess = () => {
        MyListsBindings.triggerLinkAnalytics({
            pageName: `${USER_PROFILE}:${MY_LISTS}:${LOVES.CREATE_NEW_LIST_PAGE_LOAD}:*`,
            actionInfo: `${MY_LISTS}:${LOVES.CREATE_LIST}`,
            eventStrings: [anaConsts.Event.CREATE_LIST]
        });
    };

    static createListError = error => {
        MyListsBindings.triggerLinkAnalytics({
            pageName: `${USER_PROFILE}:${MY_LISTS}:${LOVES.CREATE_NEW_LIST_PAGE_LOAD}:*`,
            errorMessages: error,
            fieldErrors: anaConsts.CONTEXT.LIST
        });
    };

    static cancelFlowListsModal = () => {
        MyListsBindings.triggerLinkAnalytics({
            pageName: `${USER_PROFILE}:${MY_LISTS}:${LOVES.MY_LISTS_MODAL}:*`,
            actionInfo: `${MY_LISTS}:${LOVES.CANCEL_MODAL}`
        });
    };

    static buildMultiProductString = ({ skuIds }) => {
        const max = skuIds.slice(0, 60);

        return max.map(id => PRODUCT_STRING_TEMPLATE.replace(/{sku}/g, id)).join(',');
    };

    static pageLoadListDetail = ({ skuIds }) => {
        MyListsBindings.triggerAsyncPageLoadAnalytics({
            pageName: LOVES.LIST_DETAIL_PAGE_NAME,
            productStrings: MyListsBindings.buildMultiProductString({ skuIds })
        });
    };

    static pageLoadShareList = ({ pageType, eventName }) => {
        MyListsBindings.triggerAsyncPageLoadAnalytics({
            pageName: `${pageType}:${eventName}:n/a:*`
        });
    };

    static trackCopyLink = ({ skuIds }) => {
        MyListsBindings.triggerLinkAnalytics({
            actionInfo: `${MY_LISTS}:${LOVES.SHARE_LINK}`,
            productStrings: MyListsBindings.buildMultiProductString({ skuIds })
        });
    };
}

export default MyListsBindings;
