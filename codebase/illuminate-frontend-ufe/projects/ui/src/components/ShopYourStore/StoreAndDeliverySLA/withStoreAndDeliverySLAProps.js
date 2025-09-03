import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
const { wrapHOC } = FrameworkUtils;
import localeUtils from 'utils/LanguageLocale';

import { userSelector } from 'selectors/user/userSelector';
import { storeAndDeliveryFlyoutSelector } from 'selectors/storeAndDeliveryFlyout/storeAndDeliveryFlyoutSelector';

import ShopMyStoreActions from 'actions/HappeningShopMyStoreActions';

const fields = createSelector(userSelector, storeAndDeliveryFlyoutSelector, (user, storeAndDeliveryFlyout) => {
    const { isInitialized } = storeAndDeliveryFlyout;
    /*
    The Shop Store & Delivery component must update its content if any of
    these values change. We're creating a unique context key here.
    If the contextKey changes, a new API call should be triggered
    to fetch fresh information.
    */
    const watchForChanges = [user.preferredStore, user.preferredZipCode, localeUtils.getCurrentLanguage()];
    const contextKey = watchForChanges.join('_');

    return {
        contextKey,
        isInitialized
    };
});

const functions = {
    fetchStoreAndDeliverySLA: ShopMyStoreActions.fetchStoreAndDeliverySLA
};

const withStoreAndDeliverySLAProps = wrapHOC(connect(fields, functions));

export {
    fields, withStoreAndDeliverySLAProps
};
