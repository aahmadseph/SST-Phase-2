/* eslint-disable object-curly-newline */

import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Box, Button, Text, Link } from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import AddressForm from 'components/Addresses/AddressForm/AddressForm';
import FormsUtils from 'utils/Forms';
import ErrorList from 'components/ErrorList';
import localeUtils from 'utils/LanguageLocale';
import AddressActions from 'actions/AddressActions';
import Actions from 'actions/Actions';
import store from 'store/Store';
import errorsUtils from 'utils/Errors';
import Debounce from 'utils/Debounce';
const getText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/Addresses/AcctAddressForm/locales', 'AcctAddressForm');

const { deleteAddress } = AddressActions;

class AcctAddressForm extends BaseClass {
    state = {
        isDefault: this.props.isFirstAddress,
        errorMessages: '',
        countryList: null
    };

    componentDidMount() {
        if (this.props.isEditMode && this.props.address.isDefault) {
            this.setState({ isDefault: true });
        }
    }

    handleIsDefault = e => {
        this.setState({ isDefault: e.target.checked });
    };

    showDeleteAddressModal = e => {
        e.preventDefault();

        //variable declaration here for clarity
        const title = getText('title');
        const message = getText('message');
        const confirmButtonText = getText('confirmButtonText');
        const callback = this.deleteAddressModalCallback;
        const hasCancelButton = true;
        const hasCloseButton = true;
        const cancelButtonText = getText('cancelButtonText');

        store.dispatch(
            Actions.showInfoModal({
                isOpen: true,
                title: title,
                message: message,
                buttonText: confirmButtonText,
                callback: callback,
                showCancelButton: hasCancelButton,
                cancelText: cancelButtonText,
                showCloseButton: hasCloseButton
            })
        );
    };

    deleteAddressModalCallback = () => {
        deleteAddress(this.props.address.addressId, this.props.profileId, this.props.deleteSavedAddressCallback, this.handleResponseError);
    };

    validateAddressForm = () => {
        this.setState({ errorMessages: '' });
        const isValid = this.addressForm.validateForm();

        if (isValid) {
            this.createAddress();
        }
    };

    validateAddressFormDebounced = Debounce.preventDoubleClick(this.validateAddressForm, 3000);

    handleResponseError = errorData => {
        errorsUtils.collectAndValidateBackEndErrors(errorData, this);
    };

    showError = (message, value, errorKey) => {
        if (!this.addressForm.handleResponseError(message, value, errorKey)) {
            this.setState({ errorMessages: [message] });
        }
    };

    createAddress = () => {
        const { getData, isAddressVerified, hasAVS } = this.addressForm;

        const newAddressData = getData();
        const dataToSend = Object.assign({}, newAddressData, {
            isDefaultAddress: this.state.isDefault,
            addressValidated: hasAVS() ? isAddressVerified() : undefined
        });

        if (this.props.isEditMode) {
            AddressActions.updateAddress(dataToSend, () => this.props.updateAddressCallback(true), this.handleResponseError);
        } else {
            AddressActions.addNewAddress(dataToSend, data => this.props.addAddressCallback(data), this.handleResponseError);
        }
    };

    render() {
        const { isEditMode, address, isFirstAddress, countryList, country, cancelAddAddressCallback, cancelEditAddressCallback } = this.props;
        const cancelCallback = cancelAddAddressCallback || cancelEditAddressCallback;

        return (
            <Box
                is='form'
                action=''
                maxWidth='40em'
                onSubmit={e => {
                    e.preventDefault();
                    this.validateAddressFormDebounced();
                }}
                noValidate
            >
                <Text
                    is='h2'
                    fontSize='md'
                    fontWeight='bold'
                    marginBottom={5}
                >
                    {getText(isEditMode ? 'edit' : 'add')} {getText('address')}
                </Text>
                <ErrorList errorMessages={this.state.errorMessages} />
                <AddressForm
                    editStore={FormsUtils.getStoreEditSectionName(FormsUtils.FORMS.PROFILE.ACCOUNT_ADDRESS)}
                    hasGridLayout={true}
                    isEditMode={isEditMode}
                    address={address}
                    countryList={countryList}
                    country={country}
                    ref={comp => {
                        if (comp !== null) {
                            this.addressForm = comp;
                        }
                    }}
                />
                <Box
                    marginTop={4}
                    css={isFirstAddress ? { display: 'none' } : null}
                >
                    <Checkbox
                        checked={this.state.isDefault}
                        onClick={this.handleIsDefault}
                        name='is_default'
                    >
                        {getText('setAsDefaultAddress')}
                    </Checkbox>
                </Box>
                {isEditMode && (
                    <Link
                        color='blue'
                        paddingY={2}
                        marginTop={3}
                        onClick={this.showDeleteAddressModal}
                    >
                        {getText('removeAddress')}
                    </Link>
                )}
                <LegacyGrid
                    gutter={4}
                    marginTop={3}
                    fill={true}
                    maxWidth='26em'
                >
                    <LegacyGrid.Cell>
                        <Button
                            variant='secondary'
                            block={true}
                            onClick={cancelCallback}
                            data-at={Sephora.debug.dataAt('saved_addresses_cancel_button')}
                        >
                            {getText('cancel')}
                        </Button>
                    </LegacyGrid.Cell>
                    <LegacyGrid.Cell>
                        <Button
                            variant='primary'
                            block={true}
                            type='submit'
                            data-at={Sephora.debug.dataAt(`saved_addresses_${isEditMode ? 'update' : 'save'}_button`)}
                        >
                            {getText(isEditMode ? 'update' : 'save')}
                        </Button>
                    </LegacyGrid.Cell>
                </LegacyGrid>
            </Box>
        );
    }
}

export default wrapComponent(AcctAddressForm, 'AcctAddressForm', true);
