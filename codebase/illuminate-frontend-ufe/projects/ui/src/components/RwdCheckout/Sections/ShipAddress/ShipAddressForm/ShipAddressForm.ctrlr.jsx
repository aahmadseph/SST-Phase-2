/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Flex, Text, Button, Link, Grid
} from 'components/ui';
import RwdAddressForm from 'components/Addresses/RwdAddressForm';
import AccessPointButton from 'components/RwdCheckout/Shared/AccessPointButton';
import AccordionButton from 'components/RwdCheckout/AccordionButton';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import userUtils from 'utils/User';
import Modal from 'components/Modal/Modal';
import FormsUtils from 'utils/Forms';
import ErrorList from 'components/ErrorList';
import UIUtils from 'utils/UI';

import orderUtils from 'utils/Order';
import errorsUtils from 'utils/Errors';
import Debounce from 'utils/Debounce';
import Location from 'utils/Location';
import processEvent from 'analytics/processEvent';
import analyticsConsts from 'analytics/constants';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import Storage from 'utils/localStorage/Storage';
import addressUtils from 'utils/Address';
import cookieUtils from 'utils/Cookies';
import userActions from 'actions/UserActions';

const { formatZipCode } = addressUtils;
const { isSMUI } = UIUtils;

const getCountryFromAddress = (address, shipCountry) => {
    const country = address?.country;

    if (address && country) {
        return country;
    } else {
        return shipCountry;
    }
};
class ShipAddressForm extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: true,
            countryList: null,
            isDefault: this.props.isDefaultChecked
        };
        this.addressForm = React.createRef();
    }

    componentDidMount() {
        this.props.togglePlaceOrderDisabled(true);
    }

    closeShipAddressForm = () => {
        if (isSMUI()) {
            this.setState({ isOpen: false }, this.props.cancelCallback());
        } else {
            this.props.cancelCallback();
        }
    };

    handleIsDefault = () => {
        this.setState({ isDefault: !this.state.isDefault });

        //Analytics
        if (!this.state.isDefault) {
            processEvent.process(analyticsConsts.LINK_TRACKING_EVENT, {
                data: {
                    eventStrings: [analyticsConsts.Event.EVENT_71, 'event121'],
                    linkName: 'D=c55',
                    pageDetail: digitalData.page.pageInfo.pageName,
                    actionInfo: `${analyticsConsts.PAGE_TYPES.CHECKOUT}:default shipping address`,
                    previousPage: 'checkout:shipping:n/a:*'
                }
            });
        }
    };

    showError = (message, value, errorKey) => {
        if (!this.addressForm.handleResponseError(message, value, errorKey)) {
            let { errorMessages } = this.state;
            errorMessages = (errorMessages || []).slice();

            if (errorMessages.indexOf(message) < 0) {
                this.setState({ errorMessages: errorMessages.concat([message]) });
            }
        }
    };

    initPaze = email => {
        if (
            Sephora.configurationSettings.globalPazeOptionEnabled &&
            Sephora.configurationSettings.guestCheckoutPazeOptionEnabled &&
            email &&
            this.props.isGuestCheckout
        ) {
            userActions.initPaze(email);
        }
    };

    validateAddressForm = e => {
        e.preventDefault();
        const email = this.addressForm?.emailInput?.state?.value;
        this.setState({ errorMessages: '' });

        // Initialize Paze for guest checkout
        this.initPaze(email);

        const isValid = this.addressForm.validateForm();

        if (isValid) {
            this.createAddress();
        }
    };
    validateAddressFormDebounce = Debounce.preventDoubleClick(this.validateAddressForm);

    createAddress = () => {
        const { getData, isAddressVerified, hasAVS } = this.addressForm;
        const { address, isNCR } = this.props;
        const _deletedFromAddressBook = address?._deletedFromAddressBook || false;

        const newAddressData = getData();
        const dataToSend = Object.assign({}, newAddressData, {
            isDefaultAddress: this.state.isDefault,
            shippingGroupId: this.props.shippingGroupId,
            addressValidated: hasAVS() ? isAddressVerified() : undefined
        });

        const orderId = orderUtils.getOrderId();
        const isSameDayOder = orderUtils.isSdd();
        let apiToCall;
        const callback = this.validateAddress;

        //if props.address exists then user is in edit mode
        if (isNCR && address && !_deletedFromAddressBook) {
            apiToCall = this.props.updateAddress;
            dataToSend.replacementOrderId = orderId;
        } else if (isNCR) {
            apiToCall = this.props.shippingAddress;
            delete dataToSend.addressId;
            dataToSend.replacementOrderId = orderId;
        } else if (address) {
            apiToCall = this.props.updateShippingAddress;
        } else {
            apiToCall = this.props.createShippingAddress;
        }

        if (apiToCall === this.props.createShippingAddress && isSameDayOder) {
            const postalCode = formatZipCode(dataToSend.address.postalCode);

            this.props
                .updatePreferredZipCode({ postalCode })
                .then(zipCodeData => {
                    const zipData = {
                        preferredZipCode: zipCodeData.zipCode,
                        encryptedStoreIds: zipCodeData.encryptedStoreIds
                    };
                    Storage.session.setItem(LOCAL_STORAGE.PREFERRED_ZIP_CODE, zipData);

                    if (Sephora.configurationSettings.setZipStoreCookie) {
                        cookieUtils.write('sameDayZipcodeCookie', zipCodeData.zipCode, null, false, false);
                    }

                    this.addressApiCall(dataToSend, apiToCall, callback, isNCR);
                })
                .catch(error => errorsUtils.collectAndValidateBackEndErrors(error, this));
        } else {
            this.addressApiCall(dataToSend, apiToCall, callback, isNCR);
        }
    };

    addressApiCall = (dataToSend, apiToCall, callback, isNCR) => {
        this.props
            .addOrUpdateAddress(dataToSend, apiToCall)
            .then(results => {
                if (results.scheduledAddrChangeMessage) {
                    this.props.showScheduledDeliveryUnavailable(results.scheduledAddrChangeMessage[0].messages[0]);
                }

                callback(results, dataToSend);
            })
            .catch(errorData => {
                // If the item is Out Of Stock at the selected address, that is not an
                // address error, so the address is created anyway, and the preferredZipcode
                // is updated by CE
                if (errorData.errors?.sameDaySkuOOSException) {
                    Storage.session.setItem(LOCAL_STORAGE.PREFERRED_ZIP_CODE, { preferredZipCode: dataToSend.address.postalCode });
                }

                if (isNCR) {
                    const { originatingOrderId } = Storage.local.getItem(LOCAL_STORAGE.NCR_ORDER) || {};
                    this.props.showSessionExpiredModal(originatingOrderId);
                } else {
                    errorsUtils.collectAndValidateBackEndErrors(errorData, this);
                }
            });
    };

    sectionSaved = () => {
        if (isSMUI()) {
            this.setState({ isOpen: false }, () => this.props.sectionSaved(Location.getLocation().pathname));
        } else {
            this.props.sectionSaved(Location.getLocation().pathname);
        }
    };

    validateAddress = (data, uiAddress) => {
        const { addressId } = data;

        if (isSMUI()) {
            this.setState({ isOpen: false }, () => this.props.validateAddress(addressId, uiAddress));
        } else {
            this.props.validateAddress(addressId, uiAddress);
        }

        if (this.props.isNCR) {
            this.props.setLastUsedShippingAddressId(addressId);
        }
    };

    render() {
        const shipCountry = userUtils.getShippingCountry().countryCode;
        const {
            isHalAvailable,
            setAccessPoint,
            localization: {
                setAsDefaultCheckbox, editShipAddress, addNewShipAddress, cancelButton, saveContinueButton
            }
        } = this.props;

        const shipAddressFormContainer = (
            <div id='ship_address_form'>
                <ErrorList errorMessages={this.state.errorMessages} />
                <RwdAddressForm
                    editStore={FormsUtils.getStoreEditSectionName(FormsUtils.FORMS.CHECKOUT.SHIPPING_ADDRESS, this.props.isNewUser)}
                    hasGridLayout={true}
                    isEditMode={!!this.props.address}
                    address={this.props.address}
                    country={getCountryFromAddress(this.props.address, shipCountry)}
                    isCheckout={true}
                    orderHasPhysicalGiftCard={this.props.orderHasPhysicalGiftCard}
                    isGuestCheckout={this.props.isGuestCheckout}
                    isCountryFieldHidden={true}
                    showAddress2Input={true}
                    onRef={comp => {
                        this.addressForm = comp;
                    }}
                />

                {isHalAvailable && (
                    <AccessPointButton
                        callback={setAccessPoint}
                        marginBottom={this.props.isFirstAddress ? 0 : 3}
                        marginTop={0}
                    />
                )}

                <div style={this.props.isFirstAddress ? { display: 'none' } : null}>
                    <Checkbox
                        checked={this.state.isDefault}
                        onClick={this.handleIsDefault}
                        name='is_default'
                    >
                        {setAsDefaultCheckbox}
                    </Checkbox>
                </div>
            </div>
        );

        return isSMUI() && !this.props.isFirstAddress ? (
            <Modal
                isOpen={this.state.isOpen}
                onDismiss={this.closeShipAddressForm}
            >
                <Modal.Header>
                    <Modal.Title>{this.props.address ? editShipAddress : addNewShipAddress}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{shipAddressFormContainer}</Modal.Body>
                <Modal.Footer>
                    <Grid gap={4}>
                        <Button
                            variant='secondary'
                            block={true}
                            onClick={this.closeShipAddressForm}
                            children={cancelButton}
                        />
                        <Button
                            variant='primary'
                            block={true}
                            onClick={this.validateAddressFormDebounce}
                            children={saveContinueButton}
                        />
                    </Grid>
                </Modal.Footer>
            </Modal>
        ) : (
            <div>
                {this.props.isFirstAddress || (
                    <Text
                        is='h2'
                        lineHeight='tight'
                        fontWeight='bold'
                        fontSize='md'
                        marginBottom={4}
                    >
                        {this.props.address ? editShipAddress : addNewShipAddress}
                    </Text>
                )}

                {shipAddressFormContainer}

                <Flex alignItems='baseline'>
                    <AccordionButton onClick={this.validateAddressFormDebounce} />
                    {this.props.isFirstAddress || (
                        <Link
                            color='blue'
                            padding={3}
                            marginLeft={3}
                            onClick={this.closeShipAddressForm}
                        >
                            {cancelButton}
                        </Link>
                    )}
                </Flex>
            </div>
        );
    }
}

export default wrapComponent(ShipAddressForm, 'ShipAddressForm');
