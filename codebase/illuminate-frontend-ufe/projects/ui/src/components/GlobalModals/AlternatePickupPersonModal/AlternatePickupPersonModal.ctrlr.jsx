/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import Modal from 'components/Modal/Modal';
import CurbsidePickupIndicator from 'components/CurbsidePickupIndicator';
import TextInput from 'components/Inputs/TextInput/TextInput';
import InputEmail from 'components/Inputs/InputEmail/InputEmail';
import FormValidator from 'utils/FormValidator';
import ErrorConstants from 'utils/ErrorConstants';
import ErrorsUtils from 'utils/Errors';
import { refreshCheckout } from 'components/FrictionlessCheckout/checkoutService/checkoutService';
import FrictionlessCheckoutBindings from 'analytics/bindingMethods/pages/FrictionlessCheckout/FrictionlessCheckoutBindings';
import {
    Box, Text, Button, Flex, Link
} from 'components/ui';
import anaConsts from 'analytics/constants';

class AlternatePickupPersonModal extends BaseClass {
    state = {
        firstName: null,
        lastName: null,
        email: null,
        hasAltPickupData: false
    };

    componentDidMount() {
        if (this.props.alternatePickupData) {
            const { firstName, lastName, email } = this.props.alternatePickupData;
            this.setState({
                hasAltPickupData: true,
                firstName,
                lastName,
                email
            });
        }
    }

    closeModal = () => {
        this.props.showAlternatePickupPersonModal({
            isOpen: false
        });
    };

    validateForm = () => {
        ErrorsUtils.clearErrors();
        const fieldsForValidation = [this.firstNameInput, this.lastNameInput, this.emailInput];
        ErrorsUtils.collectClientFieldErrors(fieldsForValidation);

        return !ErrorsUtils.validate(fieldsForValidation);
    };

    handleSave = () => {
        if (this.validateForm()) {
            const { orderId, addAlternatePickupPerson, updateAlternatePickupPerson } = this.props;
            const altPickupData = {
                firstName: this.firstNameInput.getValue(),
                lastName: this.lastNameInput.getValue(),
                email: this.emailInput.getValue(),
                orderId
            };
            const altPickupAPI = this.state.hasAltPickupData ? updateAlternatePickupPerson : addAlternatePickupPerson;
            altPickupAPI(altPickupData, '')
                .then(() => {
                    refreshCheckout()().then(() => {
                        FrictionlessCheckoutBindings.setAlternatePickupAnalytics(anaConsts?.ALT_PICKUP.SAVE);
                        this.closeModal();
                    });
                })
                .catch(error => {
                    this.showErrorModal(error);
                });
        }
    };

    showErrorModal = error => {
        const { localization, showInfoModal } = this.props;
        this.closeModal();

        showInfoModal({
            isOpen: true,
            footerColumns: [1, 2],
            title: localization.alternatePickupPerson,
            message: error?.errorCode === -1 && error.errorMessages[0] ? error.errorMessages[0] : localization.genericErrorMessage,
            buttonText: localization.ok
        });
    };

    removeAlternatePickup = () => {
        const { removeAlternatePickupPerson, orderId } = this.props;
        removeAlternatePickupPerson(orderId, '')
            .then(() => {
                refreshCheckout()().then(() => {
                    FrictionlessCheckoutBindings.setAlternatePickupAnalytics(anaConsts?.ALT_PICKUP.REMOVE);
                    this.closeModal();
                });
            })
            .catch(error => {
                this.showErrorModal(error);
            });
    };

    render() {
        const { isOpen, storeDetails } = this.props;
        const {
            alternatePickupPerson,
            pickupStore,
            serviceSLA,
            inStorePickup,
            curbSidePickup,
            confirmationDetails,
            firstName,
            lastName,
            email,
            removeAltPickupTitle,
            cancel,
            save
        } = this.props.localization;
        const showInStoreIndicator = storeDetails.isBopisable;
        const showCurbsidePickupIndicator = storeDetails.isBopisable && storeDetails.isCurbsideEnabled;

        return (
            <Modal
                isOpen={isOpen}
                onDismiss={this.closeModal}
                isDrawer={true}
                width={0}
            >
                <Modal.Header>
                    <Modal.Title>{alternatePickupPerson}</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    paddingX={4}
                    paddingBottom={0}
                >
                    <Text
                        is='p'
                        children={pickupStore}
                        marginBottom={1}
                    />
                    <Text
                        is='h4'
                        fontWeight='bold'
                        children={storeDetails.displayName}
                    />
                    <Text
                        is='p'
                        color='green'
                        fontSize={['sm', 'base']}
                        lineHeight='tight'
                        children={serviceSLA}
                    />
                    {showInStoreIndicator && (
                        <CurbsidePickupIndicator
                            children={inStorePickup}
                            iconColor='gray'
                        />
                    )}
                    {showCurbsidePickupIndicator && (
                        <CurbsidePickupIndicator
                            children={curbSidePickup}
                            iconColor='gray'
                        />
                    )}
                    <Box
                        backgroundColor={'nearWhite'}
                        paddingX={3}
                        paddingY={2}
                        maxWidth={[null, '372px']}
                        marginY={3}
                    >
                        <Text
                            is='p'
                            fontSize='sm'
                            lineHeight='tight'
                            dangerouslySetInnerHTML={{
                                __html: confirmationDetails
                            }}
                        />
                    </Box>
                    <TextInput
                        required={true}
                        name='firstName'
                        label={firstName}
                        value={this.state.firstName}
                        maxLength={FormValidator.FIELD_LENGTHS.name}
                        ref={comp => (this.firstNameInput = comp)}
                        validateError={firstname => {
                            if (FormValidator.isEmpty(firstname)) {
                                return ErrorConstants.ERROR_CODES.FIRST_NAME;
                            }

                            return null;
                        }}
                    />
                    <TextInput
                        required={true}
                        name='lastName'
                        label={lastName}
                        value={this.state.lastName}
                        maxLength={FormValidator.FIELD_LENGTHS.name}
                        ref={comp => (this.lastNameInput = comp)}
                        validateError={lastname => {
                            if (FormValidator.isEmpty(lastname)) {
                                return ErrorConstants.ERROR_CODES.LAST_NAME;
                            }

                            return null;
                        }}
                    />
                    <InputEmail
                        required={true}
                        label={email}
                        name='email'
                        login={this.state.email}
                        ref={comp => (this.emailInput = comp)}
                    />
                    {this.state.hasAltPickupData && (
                        <Link
                            color='link'
                            children={removeAltPickupTitle}
                            onClick={this.removeAlternatePickup}
                            marginBottom={4}
                        />
                    )}
                </Modal.Body>
                <Modal.Footer paddingX={4}>
                    <Flex gap={4}>
                        <Button
                            variant='secondary'
                            width='100%'
                            onClick={this.closeModal}
                            children={cancel}
                        />
                        <Button
                            variant='primary'
                            width='100%'
                            onClick={this.handleSave}
                            children={save}
                        />
                    </Flex>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default wrapComponent(AlternatePickupPersonModal, 'AlternatePickupPersonModal', true);
