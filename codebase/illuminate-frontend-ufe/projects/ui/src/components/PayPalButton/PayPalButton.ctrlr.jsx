/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Text, Button, Image } from 'components/ui';
import PayPal from 'utils/PayPal';
import LanguageLocale from 'utils/LanguageLocale';
import store from 'Store';
import addToBasketActions from 'actions/AddToBasketActions';
import userActions from 'actions/UserActions';
import basketUtils from 'utils/Basket';
import checkoutUtils from 'utils/Checkout';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import userUtils from 'utils/User';
import UtilActions from 'utils/redux/Actions';
import checkoutApi from 'services/api/checkout';
import CheckoutBindings from 'analytics/bindingMethods/pages/checkout/CheckoutBindings';

const getText = LanguageLocale.getLocaleResourceFile('components/PayPalButton/locales', 'PayPalButton');

class PayPalButton extends BaseClass {
    state = {};

    componentDidMount() {
        /**
         * Prepare payPal object with updated basket data every time on basket change.
         * So when we'll want to show the PayPal new window -> the chain of calls should be
         * as short as possible, otherwise browser will block the new window.
         * Explanation of the issue:
         * http://stackoverflow.com/questions/2587677/avoid-browser-popup-blockers
         *
         * And don't forget to refresh Paypal obj on every basket update
         */
        const { isBopis } = this.props;
        store.setAndWatch('basket', this, () => {
            PayPal.preparePaypalCheckout(isBopis);
        });
    }

    checkoutWithPayPal = () => {
        const { isBopis } = this.props;

        if (basketUtils.containsRestrictedItem()) {
            store.dispatch(addToBasketActions.showPaypalRestrictedMessage());

            return;
        }

        CheckoutBindings.checkoutPayPalClick();

        // Disable applePay session, if it was active
        store.dispatch(UtilActions.merge('applePaySession', 'isActive', false));

        const basketData = store.getState().basket || {
            items: [],
            pickupBasket: { items: [] }
        };
        const basket = isBopis ? basketData?.pickupBasket : basketData;

        if (basket.showPaypalPopUp) {
            if (basketUtils.isOnlySamplesRewardsInBasket(true, isBopis) && !userUtils.isAnonymous()) {
                const NO_STANDARD_GOODS_ERROR = 'You must add merchandise before you can proceed to checkout.';
                store.dispatch(addToBasketActions.showError({ internalError: NO_STANDARD_GOODS_ERROR }));
            } else {
                //Analytics
                processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                    data: {
                        linkName: 'checkout:payment:paypal',
                        actionInfo: 'checkout:payment:paypal',
                        eventStrings: [anaConsts.Event.EVENT_71]
                    }
                });

                PayPal.showPayPal(payload => {
                    const PayPalApiError = {
                        // is expected for New user flow
                        UNAUTHORIZED: 403,

                        // is a flag from API that they ignored Paypal address
                        INVALID_LOCALE: -10182
                    };

                    if (isBopis) {
                        payload.RopisCheckout = true;
                    }

                    checkoutApi
                        .initializePayPalCheckout(payload)
                        .then(() => {
                            // Populate user email from PayPal, if it's empty in store

                            const user = store.getState().user;

                            if (payload && payload.details && !user.login) {
                                const updatedUser = Object.assign({}, user, { login: payload.details.email });
                                store.dispatch(userActions.update(updatedUser));
                            }

                            this.goToCheckout();
                        })
                        .catch(reason => {
                            if (reason.errorCode === PayPalApiError.INVALID_LOCALE || reason.errorCode === PayPalApiError.UNAUTHORIZED) {
                                // Nothing here so far.
                            }
                        });
                });
            }
        } else {
            this.goToCheckout();
        }
    };

    goToCheckout = () => {
        const { isBopis } = this.props;

        return checkoutUtils
            .initializeCheckout({
                isPaypalFlow: true,
                ropisCheckout: isBopis
            })
            .then(() => checkoutUtils.initOrderSuccess(true, isBopis))
            .catch(checkoutUtils.initOrderFailure);
    };

    render() {
        const { hasText, isPaypalPayment, ...props } = this.props;

        if (!(isPaypalPayment !== PayPal.TYPES.HIDDEN)) {
            return null;
        }

        const isDisabled = isPaypalPayment === PayPal.TYPES.DISABLED;

        return (
            <Button
                variant='secondary'
                onClick={this.checkoutWithPayPal}
                disabled={isDisabled}
                data-at={Sephora.debug.dataAt('basket_paypal_btn')}
                css={{
                    borderWidth: 0,
                    backgroundColor: '#FFD144'
                }}
                {...props}
            >
                {hasText && (
                    <Text
                        marginRight={3}
                        verticalAlign='middle'
                    >
                        {getText('payWithText')}
                    </Text>
                )}
                <Image
                    disableLazyLoad={true}
                    width={98}
                    height={24}
                    alt='PayPal'
                    src='/img/ufe/logo-paypal.svg'
                    verticalAlign='middle'
                />
                <span
                    id='paypal-container'
                    style={{ display: 'none' }}
                />
            </Button>
        );
    }
}

export default wrapComponent(PayPalButton, 'PayPalButton', true);
