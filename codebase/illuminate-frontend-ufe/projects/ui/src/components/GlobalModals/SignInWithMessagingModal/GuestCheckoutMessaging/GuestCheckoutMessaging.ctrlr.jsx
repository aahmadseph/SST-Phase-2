/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import checkoutUtils from 'utils/Checkout';
import store from 'store/Store';
import actions from 'Actions';
import addToBasketActions from 'actions/AddToBasketActions';
import ApplePay from 'services/ApplePay';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import analyticsUtils from 'analytics/utils';
import Debounce from 'utils/Debounce';

import {
    Text, Button, Divider, Flex
} from 'components/ui';
import GuestCheckoutMessagingItem from 'components/GlobalModals/SignInWithMessagingModal/GuestCheckoutMessaging/GuestCheckoutMessagingItem/GuestCheckoutMessagingItem';
import localeUtils from 'utils/LanguageLocale';
import Markdown from 'components/Markdown/Markdown';

class GuestCheckoutMessaging extends BaseClass {
    constructor(props) {
        super(props);
    }

    initializeGuestCheckout = () => {
        const params = {
            isGuestCheckout: true,
            isPaypalFlow: this.props.isPaypalFlow,
            isApplePayFlow: this.props.isApplePayFlow
        };

        // Analytics
        const mostRecentAsyncLoadEvent = analyticsUtils.getLastAsyncPageLoadData();
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                eventStrings: [anaConsts.Event.EVENT_71, anaConsts.Event.SC_GUEST_ORDER_SIGN_IN_CLICK],
                linkName: 'guest checkout modal:continue as guest',
                actionInfo: 'guest checkout modal:continue as guest',
                ...mostRecentAsyncLoadEvent
            }
        });

        return checkoutUtils
            .initializeCheckout(params)
            .then(
                this.props.isApplePayFlow
                    ? () => {
                        ApplePay.enableGuestCheckout();
                        store.dispatch(actions.showSignInWithMessagingModal({ isOpen: false }));
                        store.dispatch(addToBasketActions.showStickyApplePayBtn(true));
                    }
                    : checkoutUtils.initOrderSuccess
            )
            .catch(reason => {
                store.dispatch(actions.showSignInWithMessagingModal({ isOpen: false }));
                checkoutUtils.initOrderFailure(reason);
            });
    };

    showRegistrationModal = () => {
        store.dispatch(actions.showSignInWithMessagingModal({ isOpen: false }));

        store.dispatch(
            actions.showRegisterModal({
                isOpen: true,
                analyticsData: { linkData: 'sign-in_create-account_click' }
            })
        );
    };

    debouncedGuestCheckoutClick = Debounce.preventDoubleClick(this.initializeGuestCheckout, 3000);

    render() {
        const getText = localeUtils.getLocaleResourceFile(
            'components/GlobalModals/SignInWithMessagingModal/GuestCheckoutMessaging/locales',
            'GuestCheckoutMessaging'
        );

        const { potentialBiPoints } = this.props;

        return (
            <div data-testid='guest-checkout-messaging'>
                <Text
                    is='h2'
                    fontSize='md'
                    marginBottom='.5em'
                    fontWeight='bold'
                    children={getText('createAccountCheckoutMessage')}
                />
                <Markdown
                    marginBottom='1em'
                    lineHeight='tight'
                    content={getText('bankYourBeautyPointsFree', [potentialBiPoints])}
                />
                <Flex
                    justifyContent='space-around'
                    lineHeight='tight'
                >
                    <GuestCheckoutMessagingItem
                        iconUrl='/img/ufe/icons/birthday.svg'
                        text={getText('freeBirthdayGift')}
                    />
                    <GuestCheckoutMessagingItem
                        iconUrl='/img/ufe/icons/saving.svg'
                        text={getText('seasonalSavingsEvents')}
                    />
                    <GuestCheckoutMessagingItem
                        iconUrl='/img/ufe/icons/shipping.svg'
                        text={getText('freeShipping')}
                    />
                </Flex>
                <Button
                    variant='secondary'
                    block={true}
                    onClick={this.showRegistrationModal}
                    data-at={Sephora.debug.dataAt('create_account_button')}
                    children={getText('createAccountButton')}
                />
                <Divider marginY={3} />
                <Button
                    variant='secondary'
                    block={true}
                    onClick={this.debouncedGuestCheckoutClick}
                    children={getText('checkOutAsAGuestButton')}
                />
            </div>
        );
    }
}

export default wrapComponent(GuestCheckoutMessaging, 'GuestCheckoutMessaging');
