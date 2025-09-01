import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
const { wrapHOC } = FrameworkUtils;
import Empty from 'constants/empty';
import { COMPONENT_SIDS } from 'constants/ShopYourStore';

import { shopSameDaySelector } from 'selectors/page/shopSameDay/shopSameDaySelector';
import { userSelector } from 'selectors/user/userSelector';
import { isTestTargetReadySelector } from 'viewModel/selectors/testTarget/isTestTargetReadySelector';
import { isShopYourStoreEnabledSelector } from 'viewModel/selectors/shopYourStore/isShopYourStoreEnabledSelector';
import { isSDUAddedToBasketSelector } from 'viewModel/selectors/basket/isSDUAddedToBasketSelector';

import ShopSameDayActions from 'actions/HappeningShopSameDayActions';
import Actions from 'Actions';

const fields = createSelector(
    shopSameDaySelector,
    userSelector,
    isTestTargetReadySelector,
    isShopYourStoreEnabledSelector,
    isSDUAddedToBasketSelector,
    (shopSameDay, user, isTestTargetReady, isShopYourStoreEnabled, isSDUAddedToBasket) => {
        const data = shopSameDay?.data || Empty.Object;
        const sameDayAvailable = !!data.sameDay?.sameDayAvailable;
        const content = data.content?.layout?.content || Empty.Array;
        const purchaseHistoryItems = data.purchaseHistory?.purchaseHistoryItems || Empty.Array;
        const shoppingListItems = data.shoppingList?.shoppingListItems || Empty.Array;
        const hasPreferredZipCode = !!user.preferredZipCode;

        /*
        The Shop Same-Day page must update its content if any of
        these values change. We're creating a unique page key here.
        If the pageKey changes, a new API call should be triggered
        to fetch fresh information.
        */
        const watchForChanges = [user.loginStatus, user.profileId, user.preferredZipCode, isSDUAddedToBasket];
        const pageKey = watchForChanges.join('_');

        if (content.length) {
            content.forEach(component => {
                switch (component.sid) {
                    case COMPONENT_SIDS.SHOP_SAME_DAY_BUY_IT_AGAIN:
                        component.skuList = purchaseHistoryItems;

                        break;

                    case COMPONENT_SIDS.SHOP_SAME_DAY_FROM_YOUR_LOVES:
                        component.skipTypeOverride = true;
                        component.skuList = shoppingListItems;

                        break;

                    // TODO: Remove this case once the Recap component supports features.
                    case 'shop-sameday-browse-more-carousel':
                        component.features = [
                            {
                                sid: 'Shop_Your_Store_Recap_sid',
                                handlerType: 'RecapSYS'
                            }
                        ];
                        component.items = sameDayAvailable ? component.items : Empty.Array;

                        break;

                    default:
                        break;
                }
            });
        }

        return {
            pageKey,
            isInitialized: shopSameDay.isInitialized,
            sameDayAvailable,
            hasPreferredZipCode,
            content,
            isTestTargetReady,
            isShopYourStoreEnabled
        };
    }
);

const functions = {
    fetchShopSameDay: ShopSameDayActions.fetchShopSameDay,
    showShippingDeliveryLocationModal: () => ShopSameDayActions.showShippingDeliveryLocationModal('landing page'),
    showInterstice: Actions.showInterstice
};

const withShopSameDayMainProps = wrapHOC(connect(fields, functions));

export {
    fields, withShopSameDayMainProps
};
