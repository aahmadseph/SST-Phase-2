import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import store from 'store/Store';
import Actions from 'Actions';

import Modal from 'components/Modal/Modal';
import {
    Box, Grid, Text, Link
} from 'components/ui';
import SignInForm from 'components/GlobalModals/SignInModal/SignInForm/SignInForm';
import CreditCardApplyMessaging from 'components/GlobalModals/SignInWithMessagingModal/CreditCardApplyMessaging/CreditCardApplyMessaging';
import SectionDivider from 'components/SectionDivider/SectionDivider';
import GuestCheckoutMessaging from 'components/GlobalModals/SignInWithMessagingModal/GuestCheckoutMessaging/GuestCheckoutMessaging';
import GuestBookingMessaging from 'components/GlobalModals/SignInWithMessagingModal/GuestBookingMessaging';
import localeUtils from 'utils/LanguageLocale';
import basketUtils from 'utils/Basket';

class SignInWithMessagingModal extends BaseClass {
    constructor(props) {
        super(props);
    }

    requestClose = () => {
        store.dispatch(Actions.showSignInWithMessagingModal({ isOpen: false }));

        if (this.props.errback) {
            this.props.errback();
        }
    };

    getModalMessaging = ({ isGuestBookingEnabled, potentialBiPoints }) => {
        if (isGuestBookingEnabled) {
            return (
                <GuestBookingMessaging
                    potentialBiPoints={potentialBiPoints}
                    {...this.props}
                />
            );
        } else {
            return (
                <GuestCheckoutMessaging
                    potentialBiPoints={potentialBiPoints}
                    {...this.props}
                />
            );
        }
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/GlobalModals/SignInWithMessagingModal/locales', 'SignInWithMessagingModal');
        const isGuestBookingEnabled = this.props.isGuestBookingEnabled ?? false;
        const potentialBiPoints = isGuestBookingEnabled ? this.props.potentialServiceBIPoints ?? 0 : basketUtils.getPotentialBiPoints() ?? 0;
        const signInMessaging = isGuestBookingEnabled
            ? getText('pointsForBooking', [potentialBiPoints])
            : getText('pointsAndFreeShip', [potentialBiPoints]);

        return (
            <Modal
                isOpen={this.props.isOpen}
                onDismiss={this.requestClose}
                width={4}
                dataAt={'sign_in'}
            >
                <Modal.Header>
                    <Modal.Title>{getText('wantToSaveYourPoints', [potentialBiPoints])}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Grid
                        gap={[null, 6]}
                        columns={[null, '1fr auto 1fr']}
                    >
                        <SignInForm
                            isSignInWithMessaging={true}
                            signInMessaging={signInMessaging}
                            {...this.props}
                        />
                        <SectionDivider display={['block', 'none']} />
                        <Box
                            borderLeftWidth={[null, 1]}
                            borderColor='divider'
                        />

                        {this.props.isCreditCardApply ? (
                            <CreditCardApplyMessaging {...this.props} />
                        ) : (
                            this.getModalMessaging({ isGuestBookingEnabled, potentialBiPoints })
                        )}
                    </Grid>
                </Modal.Body>

                {this.props.isCreditCardApply && (
                    <Modal.Footer hasBorder={true}>
                        <Text
                            is='p'
                            textAlign='center'
                            fontSize='sm'
                        >
                            <Link
                                color='blue'
                                underline={true}
                                href='/terms-of-purchase'
                                children={getText('termsOfUseLink')}
                            />
                            {' & '}
                            <Link
                                color='blue'
                                underline={true}
                                href='/privacy-policy'
                                children={getText('privacyPolicyLink')}
                            />
                        </Text>
                    </Modal.Footer>
                )}
            </Modal>
        );
    }
}

export default wrapComponent(SignInWithMessagingModal, 'SignInWithMessagingModal');
