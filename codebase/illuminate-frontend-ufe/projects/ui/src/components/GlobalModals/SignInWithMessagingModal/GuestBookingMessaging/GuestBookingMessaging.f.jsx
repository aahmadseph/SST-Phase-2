/* eslint-disable class-methods-use-this */
import React from 'react';
import { useCallback } from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

import Debounce from 'utils/Debounce';
import StringUtils from 'utils/String';

import { fontSizes, lineHeights, fontWeights } from 'style/config';

import {
    Text, Button, Divider, Flex
} from 'components/ui';
import GuestBookingMessagingItem from 'components/GlobalModals/SignInWithMessagingModal/GuestBookingMessaging/GuestBookingMessagingItem/GuestBookingMessagingItem';
import Markdown from 'components/Markdown/Markdown';

function GuestBookingMessaging({
    potentialBiPoints, localization, showSignInWithMessagingModal, showRegisterModal, extraParams, callback
}) {
    const {
        createAccountBookingMessage,
        bankYourBeautyPointsFree,
        freeBirthdayGift,
        seasonalSavingsEvents,
        freeShipping,
        createAccountButton,
        bookingAsAGuestButton
    } = localization;

    const initializeGuestBooking = () => {
        showSignInWithMessagingModal({ isOpen: false });
        typeof extraParams?.onContinueAsAGuest === 'function' && extraParams.onContinueAsAGuest();
    };

    const showRegistrationModal = () => {
        showSignInWithMessagingModal({ isOpen: false });
        showRegisterModal({
            isOpen: true,
            analyticsData: { linkData: 'sign-in_create-account_click' },
            extraParams: { isBookingFlow: true, potentialBiPoints },
            callback
        });
    };

    const debounceIntervalForGuestBooking = 3000;
    const debouncedGuestBookingClick = useCallback(Debounce.preventDoubleClick(initializeGuestBooking, debounceIntervalForGuestBooking), []);

    return (
        <div data-testid='guest-booking-messaging'>
            <div>
                <Text
                    is='h2'
                    fontSize={fontSizes.base}
                    marginBottom={2}
                    fontWeight={fontWeights.bold}
                    children={createAccountBookingMessage}
                />
                <Markdown
                    marginBottom={4}
                    lineHeight={lineHeights.tight}
                    content={StringUtils.format(bankYourBeautyPointsFree, potentialBiPoints ?? 0)}
                />
                <Flex
                    justifyContent='space-around'
                    lineHeight={lineHeights.tight}
                >
                    <GuestBookingMessagingItem
                        iconUrl='/img/ufe/icons/birthday.svg'
                        text={freeBirthdayGift}
                    />
                    <GuestBookingMessagingItem
                        iconUrl='/img/ufe/icons/saving.svg'
                        text={seasonalSavingsEvents}
                    />
                    <GuestBookingMessagingItem
                        iconUrl='/img/ufe/icons/shipping.svg'
                        text={freeShipping}
                    />
                </Flex>
            </div>
            <Button
                variant='secondary'
                block={true}
                onClick={showRegistrationModal}
                data-at={Sephora.debug.dataAt('create_account_button')}
                children={createAccountButton}
            />
            <Divider marginY={3} />
            <Button
                variant='secondary'
                block={true}
                onClick={debouncedGuestBookingClick}
                children={bookingAsAGuestButton}
            />
        </div>
    );
}

export default wrapFunctionalComponent(GuestBookingMessaging, 'GuestBookingMessaging');
