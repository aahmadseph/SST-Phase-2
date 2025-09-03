/* eslint-disable class-methods-use-this */

import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import Modal from 'components/Modal/Modal';
import SignInForm from 'components/GlobalModals/SignInModal/SignInForm/SignInForm';
import SectionDivider from 'components/SectionDivider/SectionDivider';
import {
    Box, Button, Grid, Text
} from 'components/ui';
import GuestForm from 'components/GlobalModals/EDP/SignInWithAuthenticateModal/GuestForm/GuestForm';
import ExperienceDetailsUtils from 'utils/ExperienceDetails';
import ACTIVITY from 'constants/happening/activityConstants';
import localeUtils from 'utils/LanguageLocale';
import store from 'store/Store';
import Actions from 'Actions';

class SignInWithAuthenticateModal extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            active: false
        };
    }

    continueAsGuest = () => {
        const { onSubmit } = this.props;

        if (onSubmit) {
            onSubmit(() => this.setState({ active: !this.state.active }));
        } else {
            this.setState({ active: !this.state.active });
        }
    };

    requestClose = () => {
        store.dispatch(Actions.showAuthenticateModal({ isOpen: false }));
    };

    toggleActive = () => this.setState({ active: !this.state.active });

    render() {
        const getText = localeUtils.getLocaleResourceFile(
            'components/GlobalModals/EDP/SignInWithAuthenticateModal/locales',
            'SignInWithAuthenticateModal'
        );
        const { selectedActivity, selectedTimeSlot, storeName, hasSpecialRequests } = this.props.activityDetails;

        const price = selectedActivity.priceInfo && selectedActivity.priceInfo.listPrice;

        return (
            <Modal
                isOpen={this.props.isOpen}
                onDismiss={this.requestClose}
                width={4}
                dataAt={'sign_in'}
            >
                <Modal.Header>
                    <Modal.Title>{selectedActivity.name}</Modal.Title>
                    {selectedTimeSlot.startDateTime && storeName && (
                        <Text
                            is='p'
                            marginTop={1}
                            lineHeight='tight'
                            fontWeight='bold'
                            fontSize='xs'
                            color='gray'
                            css={{ textTransform: 'uppercase' }}
                            children={ExperienceDetailsUtils.getBookingModalDate(this.props.activityDetails)}
                        />
                    )}
                    {selectedActivity.type === ACTIVITY.TYPE.SERVICES && price && (
                        <Text
                            is='p'
                            fontSize='base'
                            fontWeight='bold'
                            children={price}
                        />
                    )}
                </Modal.Header>
                <Modal.Body>
                    <Grid
                        gap={[null, 6]}
                        columns={[null, '1fr auto 1fr']}
                    >
                        <div>
                            {this.state.active || (
                                <SignInForm
                                    isSignInWithAuthenticateModal={true}
                                    active={this.state.active}
                                    {...this.props}
                                />
                            )}
                            {this.state.active && (
                                <React.Fragment>
                                    <Text
                                        is='h2'
                                        fontSize='md'
                                        marginBottom={4}
                                        fontWeight='bold'
                                        children={getText('haveAccount')}
                                    />
                                    <Button
                                        variant='secondary'
                                        block={true}
                                        onClick={this.toggleActive}
                                        children={getText('signIn')}
                                    />
                                </React.Fragment>
                            )}
                        </div>
                        <SectionDivider display={['block', 'none']} />
                        <Box
                            borderLeftWidth={[null, 1]}
                            borderColor='divider'
                        />
                        <div>
                            <Text
                                is='h2'
                                fontSize='md'
                                marginBottom='.5em'
                                fontWeight='bold'
                            >
                                {getText('continueAsGuest')}
                            </Text>
                            <Text
                                is='p'
                                marginBottom='1em'
                            >
                                {getText('createAccountAfterBooking')}
                            </Text>
                            {this.state.active ? (
                                <React.Fragment>
                                    <GuestForm
                                        hasSpecialRequests={hasSpecialRequests}
                                        hasPrice={selectedActivity.type === ACTIVITY.TYPE.SERVICES && price}
                                        getGuestDetails={this.props.getGuestDetails}
                                        activityId={selectedActivity && selectedActivity.activityId}
                                    />
                                    <Text
                                        is='p'
                                        fontSize='sm'
                                        color='gray'
                                        lineHeight='tight'
                                        marginTop={4}
                                    >
                                        {ExperienceDetailsUtils.getTelephoneUseAuthorization()}
                                    </Text>
                                </React.Fragment>
                            ) : (
                                <Button
                                    variant='secondary'
                                    block={true}
                                    onClick={this.continueAsGuest}
                                    data-at={Sephora.debug.dataAt('continue_as_guest')}
                                    children={getText('continueAsGuest')}
                                />
                            )}
                        </div>
                    </Grid>
                </Modal.Body>
            </Modal>
        );
    }
}

export default wrapComponent(SignInWithAuthenticateModal, 'SignInWithAuthenticateModal');
