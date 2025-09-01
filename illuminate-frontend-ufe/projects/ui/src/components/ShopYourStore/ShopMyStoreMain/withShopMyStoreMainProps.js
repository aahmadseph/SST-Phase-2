import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
const { wrapHOC } = FrameworkUtils;
import Empty from 'constants/empty';
import { COMPONENT_SIDS } from 'constants/ShopYourStore';
import sysUtils from 'utils/ShopYourStore';

import { shopMyStoreSelector } from 'selectors/page/shopMyStore/shopMyStoreSelector';
import { userSelector } from 'selectors/user/userSelector';
import { isTestTargetReadySelector } from 'viewModel/selectors/testTarget/isTestTargetReadySelector';
import { isShopYourStoreEnabledSelector } from 'viewModel/selectors/shopYourStore/isShopYourStoreEnabledSelector';

import ShopMyStoreActions from 'actions/HappeningShopMyStoreActions';
import Actions from 'Actions';

const fields = createSelector(
    shopMyStoreSelector,
    userSelector,
    isTestTargetReadySelector,
    isShopYourStoreEnabledSelector,
    (shopMyStore, user, isTestTargetReady, isShopYourStoreEnabled) => {
        const data = shopMyStore?.data || Empty.Object;
        const content = data.content?.layout?.content || Empty.Array;
        const purchaseHistoryItems = data.purchaseHistory?.purchaseHistoryItems || Empty.Array;
        const shoppingListItems = data.shoppingList?.shoppingListItems || Empty.Array;
        const servicesItems = sysUtils.transformCardRenderings(data.storeActivities?.services) || Empty.Array;
        const eventsItems = sysUtils.transformCardRenderings(data.storeActivities?.events) || Empty.Array;
        const isBopisable = !!data?.storeDetails?.isBopisable;
        const hasPreferredStore = !!user.preferredStore;

        /*
        The Shop My Store page must update its content if any of
        these values change. We're creating a unique page key here.
        If the pageKey changes, a new API call should be triggered
        to fetch fresh information.
        */
        const watchForChanges = [user.loginStatus, user.profileId, user.preferredStore];
        const pageKey = watchForChanges.join('_');

        if (content.length) {
            content.forEach(component => {
                switch (component.sid) {
                    case COMPONENT_SIDS.SHOP_MY_STORE_BUY_IT_AGAIN:
                        component.skuList = purchaseHistoryItems;

                        break;

                    case COMPONENT_SIDS.SHOP_MY_STORE_FROM_YOUR_LOVES:
                        component.skipTypeOverride = true;
                        component.skuList = shoppingListItems;

                        break;

                    case COMPONENT_SIDS.SHOP_MY_STORE_SERVICES:
                        component.items = servicesItems;

                        break;

                    case COMPONENT_SIDS.SHOP_MY_STORE_EVENTS:
                        component.items = eventsItems;

                        break;

                    // TODO: Remove this case once the Recap component supports features.
                    case 'shop-store-browse-more-carousel':
                        component.features = [
                            {
                                sid: 'Shop_Your_Store_Recap_sid',
                                handlerType: 'RecapSYS'
                            }
                        ];
                        component.items = isBopisable ? component.items : Empty.Array;

                        break;

                    default:
                        break;
                }
            });
        }

        return {
            pageKey,
            isInitialized: shopMyStore.isInitialized,
            content,
            isBopisable,
            hasPreferredStore,
            isTestTargetReady,
            isShopYourStoreEnabled
        };
    }
);

const functions = {
    fetchShopMyStore: ShopMyStoreActions.fetchShopMyStore,
    showStoreSwitcherModal: () => ShopMyStoreActions.showStoreSwitcherModal('landing page'),
    showInterstice: Actions.showInterstice
};

const withShopMyStoreMainProps = wrapHOC(connect(fields, functions));

export {
    fields, withShopMyStoreMainProps
};
