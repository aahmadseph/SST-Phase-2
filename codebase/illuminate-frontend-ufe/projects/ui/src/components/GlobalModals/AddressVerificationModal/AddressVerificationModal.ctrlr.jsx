import React from 'react';
import Modal from 'components/Modal/Modal';
import {
    Text, Box, Button, Link
} from 'components/ui';
import addressConstants from 'constants/Address';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import store from 'Store';
import actions from 'Actions';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

const { getLocaleResourceFile, COUNTRY_LONG_NAMES } = LanguageLocaleUtils;
const { showAddressVerificationModal } = actions;

class AddressVerificationModal extends BaseClass {
    handleDismiss = () => {
        const { cancelCallback } = this.props;
        this.requestClose(cancelCallback);
    };

    handleEditAddress = () => {
        const { successCallback } = this.props;
        this.requestClose(successCallback);
    };

    handleUseAddress = () => {
        const { cancelCallback } = this.props;
        this.requestClose(cancelCallback);
    };

    render() {
        const getText = getLocaleResourceFile('components/GlobalModals/locales', 'modals');
        const { isOpen, verificationType, currentAddress, recommendedAddress } = this.props;
        const { BUTTON_TEXT, TITLE, LEGEND, DATA_AT } = addressConstants.ADDRESS_VERIFICATION_MODAL[verificationType];

        return (
            <Modal
                isOpen={isOpen}
                onDismiss={this.handleDismiss}
                width={0}
                dataAt={DATA_AT}
            >
                <Modal.Header>
                    <Modal.Title>{TITLE}</Modal.Title>
                </Modal.Header>
                <Modal.Body lineHeight='tight'>
                    <Text
                        is='p'
                        fontSize='md'
                        marginBottom={5}
                        children={LEGEND}
                    />
                    <Text
                        is='p'
                        marginBottom={4}
                        fontWeight='bold'
                        children={getText('youEntered')}
                    />
                    {this.renderAddress(currentAddress)}
                    {recommendedAddress && (
                        <Box
                            data-at={'recommend_address'}
                            paddingX={5}
                            paddingY={4}
                            marginY={5}
                            backgroundColor='nearWhite'
                            borderRadius={2}
                        >
                            <Text
                                is='p'
                                marginBottom={4}
                                fontWeight='bold'
                                children={getText('recommended')}
                            />
                            {this.renderAddress(recommendedAddress)}
                        </Box>
                    )}
                    <Button
                        data-at={Sephora.debug.dataAt('edit_address_btn')}
                        variant='primary'
                        block={true}
                        marginY={5}
                        onClick={this.handleEditAddress}
                        children={BUTTON_TEXT}
                    />
                    <Link
                        data-at={Sephora.debug.dataAt('use_address_btn')}
                        display='block'
                        padding={2}
                        margin={-2}
                        color='blue'
                        onClick={this.handleUseAddress}
                    >
                        {getText('useTheAddress')}
                    </Link>
                </Modal.Body>
            </Modal>
        );
    }

    renderAddress = address => {
        return (
            <React.Fragment>
                {address.address1}
                <br />
                {address.address2 && (
                    <React.Fragment>
                        {address.address2}
                        <br />
                    </React.Fragment>
                )}
                {address.city}, {address.state} {address.postalCode}
                <br />
                {COUNTRY_LONG_NAMES[address.country]}
            </React.Fragment>
        );
    };

    requestClose = callback => {
        store.dispatch(showAddressVerificationModal({ isOpen: false }));

        if (typeof callback === 'function') {
            callback();
        }
    };
}

export default wrapComponent(AddressVerificationModal, 'AddressVerificationModal', true);
