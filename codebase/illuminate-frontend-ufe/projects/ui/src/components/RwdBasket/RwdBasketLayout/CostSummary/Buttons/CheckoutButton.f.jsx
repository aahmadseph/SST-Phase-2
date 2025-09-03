import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Button } from 'components/ui';
import localeUtils from 'utils/LanguageLocale';
import RwdBasketActions from 'actions/RwdBasketActions/RwdBasketActions';
import store from 'store/Store';
import anaConsts from 'analytics/constants';
import debounceUtils from 'utils/Debounce';

import processEvent from 'analytics/processEvent';
import clickCheckout from 'analytics/bindings/pages/basket/clickCheckout';

const { initiateCheckout, openCheckoutInEligibleModal } = RwdBasketActions;
const { dispatch } = store;

function CheckoutButton({
    isBopis, isCheckoutDisabled, isSignedIn, hasSDDItem, isRougeRewardsApplied, ...props
}) {
    const getText = localeUtils.getLocaleResourceFile('components/RwdBasket/RwdBasketLayout/CostSummary/Buttons/locales', 'CheckoutButton');

    const standardCheckoutClicked = () => {
        if (isSignedIn) {
            processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    bindingMethods: [clickCheckout],
                    previousPageName: digitalData.page.attributes?.previousPageData?.pageName,
                    pageDetail: digitalData.page.pageInfo.pageName,
                    pageName: digitalData.page.attributes?.sephoraPageInfo?.pageName
                }
            });
        }
    };

    // 3 sec debounce to minimize dupe clicks within reason for slow connections
    const handleClick = debounceUtils.preventDoubleClick(() => {
        if (hasSDDItem && isRougeRewardsApplied) {
            dispatch(
                openCheckoutInEligibleModal({
                    title: getText('rewardWarning'),
                    message: getText('checkoutIneligibleForSdd'),
                    buttonText: getText('gotIt')
                })
            );
        } else if (!isCheckoutDisabled) {
            standardCheckoutClicked();
            dispatch(initiateCheckout(isBopis));
        }
    }, 3000);

    return (
        <Button
            {...props}
            variant='special'
            disabled={isCheckoutDisabled}
            data-at={Sephora.debug.dataAt('basket_checkout_btn')}
            onClick={handleClick}
            children={getText('checkout')}
        />
    );
}

export default wrapFunctionalComponent(CheckoutButton, 'CheckoutButton');
