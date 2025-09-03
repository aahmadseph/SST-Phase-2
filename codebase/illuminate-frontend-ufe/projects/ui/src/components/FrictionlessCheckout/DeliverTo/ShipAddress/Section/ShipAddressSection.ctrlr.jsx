/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */
import React from 'react';
import ReactDOM from 'react-dom';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Box, Text, Flex, Divider, Link
} from 'components/ui';
import { forms, space, mediaQueries } from 'style/config';
import Address from 'components/Addresses/Address';
import ShipAddressForm from 'components/FrictionlessCheckout/DeliverTo/ShipAddress/ShipAddressForm';
import AccordionButton from 'components/FrictionlessCheckout/LayoutCard/AccordionButton';
import Radio from 'components/Inputs/Radio/Radio';
import IconCross from 'components/LegacyIcon/IconCross';
import orderUtils from 'utils/Order';
import store from 'store/Store';
import OrderActions from 'actions/OrderActions';
import Debounce from 'utils/Debounce';
import Actions from 'Actions';
import AddressActions from 'actions/AddressActions';
import ShipAddressActions from 'actions/ShipAddressActions';
import userUtils from 'utils/User';
import ErrorsUtils from 'utils/Errors';
import decorators from 'utils/decorators';
import { INTERSTICE_DELAY_MS } from 'components/RwdCheckout/constants';
import checkoutBindings from 'analytics/bindings/pages/checkout/checkoutBindings';
import UI from 'utils/UI';
import updatePreferredZipCode from 'services/api/profile/updatePreferredZipCode';
import addressUtils from 'utils/Address';
import { VALIDATE_ADDRESS } from 'constants/actionTypes/order';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import Storage from 'utils/localStorage/Storage';
import anaConsts from 'analytics/constants';
import selfReturnApi from 'services/api/selfReturn';
import processEvent from 'analytics/processEvent';
import cookieUtils from 'utils/Cookies';
import TaxClaimUtils from 'utils/TaxClaim';
import FrictionlessUtils from 'utils/FrictionlessCheckout';
import FrictionlessCheckoutBindings from 'analytics/bindingMethods/pages/FrictionlessCheckout/FrictionlessCheckoutBindings';
import { SECTION_NAMES } from 'constants/frictionlessCheckout';

const { setErrorsFromCheckoutAPI } = FrictionlessUtils;
const { isHalAddress } = orderUtils;

const { hasAVS, formatZipCode } = addressUtils;

let unsubscribe;

class ShipAddressSection extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            openAddressForm: this.props.openAddressForm || false,
            addressesToDisplay: 3,
            currentShipAddressId: this.props.shippingAddress && this.props.shippingAddress.addressId,
            shippingMethod: this.props.shippingMethod
        };
    }

    componentDidMount() {
        if (isHalAddress(this.props.profileAddresses[0])) {
            this.setState({ currentShipAddressId: this.props.profileAddresses[0].addressId });
            this.setNewShippingAddress(this.props.profileAddresses[0]);
        }

        unsubscribe = store.watchAction(VALIDATE_ADDRESS, action => {
            this.setState({ openAddressForm: false });
            this.validateAddress(action.addressId, action.uiAddress);
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.isNCR) {
            this.setState({ currentShipAddressId: nextProps.profileAddresses[0].addressId });
            this.setNewShippingAddress(nextProps.profileAddresses[0]);
        }
    }

    handleShowMoreOnClick = () => {
        let newDisplayNum = this.state.addressesToDisplay + 3;

        if (newDisplayNum > this.props.profileAddresses.length) {
            newDisplayNum = this.props.profileAddresses.length;
        }

        const refKeys = Object.keys(this.refs);

        this.setState({ addressesToDisplay: newDisplayNum }, () => {
            const element = ReactDOM.findDOMNode(this.refs[refKeys[refKeys.length - 1]]);
            element.scrollIntoView({
                block: 'start',
                behavior: 'smooth'
            });

            if (this.props.isNCR) {
                checkoutBindings.processAsyncPageLoad('show more addresses', anaConsts.PAGE_TYPES.REPLACEMENT_ORDER);
            }
        });
    };

    handleShowLessOnClick = () => {
        //after user clicks show less link,
        //return user to display of default 3 addresses
        this.setState({ addressesToDisplay: 3 }, () => {
            const element = ReactDOM.findDOMNode(this.refs.shipAddress0);
            element.scrollIntoView({
                block: 'start',
                behavior: 'smooth'
            });
        });
    };

    setAnalyticsAndErrors = (sectionName, errors) => {
        if (Object.keys(errors)?.length > 0) {
            FrictionlessCheckoutBindings.setSectionLevelErrorAnalytics(sectionName, errors[sectionName]);
            this.props.setCheckoutSectionErrors(errors);
        }
    };

    showAddShipAddressForm = e => {
        const { removeAddressLabel, continueButton, getText } = this.props;

        e.preventDefault();

        const maxShippingAddress = Sephora.configurationSettings.maxShippingAddress;

        if (this.props.profileAddresses.length === maxShippingAddress) {
            //variable declaration here for clarity
            const title = removeAddressLabel;
            const message = getText('maxShipAddressMessage', [maxShippingAddress]);
            const confirmButtonText = continueButton;

            store.dispatch(
                Actions.showInfoModal({
                    isOpen: true,
                    title: title,
                    message: message,
                    buttonText: confirmButtonText
                })
            );
        } else {
            this.setState({ openAddressForm: true, editAddress: null });
        }
    };

    showEditShipAddressForm = address => {
        this.setState(
            {
                openAddressForm: true,
                editAddress: address
            },
            () => {
                // Analytics :: Show Edit Address Form Tracking - ILLUPH-95708
                const pageType = this.props.isNCR ? anaConsts.PAGE_TYPES.REPLACEMENT_ORDER : undefined;
                const pageDetailPrefix = this.props.isGiftCardAddress ? 'gift card ' : '';
                checkoutBindings.processAsyncPageLoad(pageDetailPrefix + 'shipping-edit address', pageType);
            }
        );
    };

    showRemoveShipAddressModal = (addressId, e) => {
        const { removeAddressLabel, areYouSureMessage, remove, cancelButton } = this.props;

        e.preventDefault();

        //variable declaration here for clarity
        const title = removeAddressLabel;
        const message = areYouSureMessage;
        const confirmButtonText = remove;
        const cancelButtonText = cancelButton;

        const hasCancelButton = true;
        const callback = () => {
            const orderId = orderUtils.getOrderId();
            ShipAddressActions.removeOrderShippingAddress(orderId, this.props.shippingGroupId, addressId)
                .then(() => {
                    //if current addressId user removes is the current orderShipAddressId
                    //we need to update the order details since now user has no order shipping address
                    if (this.props.shippingAddress && addressId === this.props.shippingAddress.addressId) {
                        ShipAddressActions.getOrderDetails(orderId).catch(this.handleResponseError);
                    }

                    ShipAddressActions.getAddressBook(this.props.isReshipOrder || false)
                        .then(addressData => {
                            const { addressList = [] } = addressData;
                            AddressActions.updateDefaultShippingAddressData(addressList);
                        })
                        .catch(this.handleResponseError);
                })
                .catch(this.handleResponseError);
        };

        store.dispatch(
            Actions.showInfoModal({
                isOpen: true,
                title: title,
                message: message,
                buttonText: confirmButtonText,
                callback: callback,
                showCancelButton: hasCancelButton,
                cancelText: cancelButtonText,
                showCloseButton: true
            })
        );
    };

    showRemoveShipAddressModalDebounce = Debounce.preventDoubleClick(this.showRemoveShipAddressModal);

    closeAddressForm = () => {
        this.setState({
            openAddressForm: false,
            editAddress: null
        });
    };

    updateNcrShippingAddress = addressData => {
        const { onAddressSelect, isNCR } = this.props;

        if (isNCR && typeof onAddressSelect === 'function') {
            onAddressSelect(addressData);
        }
    };

    setNewShippingAddress = (addressData = {}, triggerUpdateNcrShippingAddress = false) => {
        const { currentShipAddressId } = this.state;
        const userSelectedNewAddress = currentShipAddressId !== addressData.addressId;
        const shouldUpdateNcrShippingAddress = userSelectedNewAddress && triggerUpdateNcrShippingAddress;
        const newAddressData = Object.assign({}, addressData);

        const isPOBoxAddress = newAddressData.isPOBoxAddress;
        const addressType = newAddressData.addressType;

        /* need to remove address.isDefault, address.isAddressVerified, address.isPOBoxAddress, address.addressType
        from data we send to update order shipping address */
        delete newAddressData.isDefault;
        delete newAddressData.isAddressVerified;
        delete newAddressData.formattedPhone;
        delete newAddressData.isPOBoxAddress;
        delete newAddressData.addressType;

        this.newShippingAddress = {
            address: newAddressData,
            isPOBoxAddress,
            addressType,
            isDefaultAddress: addressData.isDefault,
            shippingGroupId: this.props.shippingGroupId,
            addressValidated: hasAVS(addressData.country) && addressData.isAddressVerified ? true : undefined
        };

        this.setState({ currentShipAddressId: newAddressData.addressId }, () => {
            if (shouldUpdateNcrShippingAddress) {
                this.updateNcrShippingAddress(this.newShippingAddress);
            }
        });
    };

    moveToNextSection = address => {
        const { country, addressId } = address;

        if (hasAVS(country)) {
            this.validateAddress(addressId);
        } else {
            this.props.saveAddress(this);
        }
    };

    saveAndContinue = e => {
        e.preventDefault();

        if (!this.newShippingAddress && !this.props.shippingAddress) {
            //if user hasn't selected a newShippingAddress or has removed the currentShippingAddress,
            //then there is no currentShippingAddress and user stays on section
        } else if (!this.newShippingAddress && this.props.shippingAddress) {
            //if user hasn't selected a newShippingAddress but
            //there is a currentShippingAddress, move on to next section without calling get order api
            //and if it has AVS validate it first
            this.moveToNextSection(this.props.shippingAddress);
        } else {
            //if user has selected a newShippingAddress make updateShippingAddress api call
            //and validate address
            const postalCode = formatZipCode(this.newShippingAddress.address.postalCode);

            updatePreferredZipCode({ postalCode })
                .then(zipCodeData => {
                    const zipData = {
                        preferredZipCode: zipCodeData.zipCode,
                        encryptedStoreIds: zipCodeData.encryptedStoreIds
                    };
                    Storage.session.setItem(LOCAL_STORAGE.PREFERRED_ZIP_CODE, zipData);

                    if (Sephora.configurationSettings.setZipStoreCookie) {
                        cookieUtils.write('sameDayZipcodeCookie', zipCodeData.zipCode, null, false, false);
                    }

                    ShipAddressActions.updateShippingAddress(this.newShippingAddress)
                        .then(data => {
                            if (data.scheduledAddrChangeMessage) {
                                store.dispatch(OrderActions.showScheduledDeliveryUnavailable(data.scheduledAddrChangeMessage[0].messages[0]));
                                const errors = setErrorsFromCheckoutAPI(data);
                                this.setAnalyticsAndErrors(SECTION_NAMES.SDD, errors);
                            }

                            this.validateAddress(this.newShippingAddress.address.addressId);
                        })
                        .catch(this.handleResponseError);
                })
                .catch(this.handleResponseError);
        }
    };

    saveAndContinueDebounce = Debounce.preventDoubleClick(this.saveAndContinue);

    validateAddress = (addressId, originalAddress) => {
        ErrorsUtils.clearErrors();
        this.props.clearNamedSectionErrors([SECTION_NAMES.SDD, SECTION_NAMES.DELIVER_TO]);
        /* Do not validate for the following scenarios:
            - AVS flag is off or it is International
        */
        const shipCountry = userUtils.getShippingCountry().countryCode;
        const { isNCR } = this.props;
        const orderId = orderUtils.getOrderId();

        if (!hasAVS(shipCountry) || (!addressId && !this.props.isGuestCheckout)) {
            this.sectionSaved();

            return;
        }

        let getAddressBook = ShipAddressActions.getAddressBook;

        // Guest checkout validation process
        // Since guest addresses don't have real ids - use what we have in address
        // or generate a UUID since it's required for the API call
        if (this.props.isGuestCheckout && originalAddress && originalAddress.address) {
            getAddressBook = () =>
                Promise.resolve({
                    addressList: [
                        {
                            ...originalAddress.address,
                            initialAddressId: originalAddress.address.addressId || UI.uuid(),
                            addressId
                        }
                    ]
                });
        }

        const increaseSessionAddressValidationCount = () => {
            const addressValidationCount = Storage.session.getItem(LOCAL_STORAGE.MAX_ADDRESS_VALIDATION_COUNT) + 1;
            Storage.session.setItem(LOCAL_STORAGE.MAX_ADDRESS_VALIDATION_COUNT, addressValidationCount);
        };

        /* When sending addressValidated=false 6 times, BE will send isAddressVerified=true all the time
        But we don't know about this counter on FE, that's why we need to get the Address Book
        and use the value isAddressVerified from BE instead of the isAddressVerified from the form */
        getAddressBook(this.props.isReshipOrder || false)
            .then(addressBook => {
                const addressData = addressBook.addressList.find(address => address.addressId === addressId);
                const maxAddressValidationCount = Storage.session.getItem(LOCAL_STORAGE.MAX_ADDRESS_VALIDATION_COUNT);
                const hasReachedMaxValidations = maxAddressValidationCount >= Sephora.configurationSettings.maxAddressValidationCount;
                const pageType = isNCR ? anaConsts.PAGE_TYPES.REPLACEMENT_ORDER : undefined;

                // Update cached Shipping Address
                AddressActions.updateDefaultShippingAddressData(addressBook.addressList);

                // Do not validate if address exists and it is already verified
                if (!addressData || addressData.isAddressVerified || hasReachedMaxValidations) {
                    this.sectionSaved();

                    return;
                }

                // Substitute an addressId with an "initial" one. For guests cases
                if (!addressId && addressData.initialAddressId) {
                    addressData.addressId = addressData.initialAddressId;
                }

                delete addressData.initialAddressId;

                // Set new Shipping Address so when the user ignores the modal it keeps the correct address selected
                this.setNewShippingAddress(addressData);

                // Clean the address details for API Calls
                const isDefaultAddress = addressData.isDefault;

                delete addressData.isAddressVerified;
                delete addressData.isDefault;
                delete addressData.formattedPhone;
                delete addressData.isPOBoxAddress;
                delete addressData.addressType;

                const updateAddressApi = isNCR
                    ? decorators.withInterstice(selfReturnApi.updateAddress, INTERSTICE_DELAY_MS)
                    : ShipAddressActions.updateShippingAddress;

                // API Call
                decorators.withInterstice(AddressActions.validateAddress, INTERSTICE_DELAY_MS)(
                    addressData,
                    {
                        // When user accepts the recommended address
                        RECOMMENDED: recommendedAddress => {
                            const recommendedIsPOBoxAddress = recommendedAddress.isPOBoxAddress;
                            const recommendedAddressType = recommendedAddress.addressType;

                            // Clean the recommendedAddress details for API Calls
                            delete recommendedAddress.isPOBoxAddress;
                            delete recommendedAddress.addressType;

                            const dataToSend = {
                                address: Object.assign({}, addressData, recommendedAddress),
                                isPOBoxAddress: recommendedIsPOBoxAddress,
                                addressType: recommendedAddressType,
                                isDefaultAddress,
                                addressValidated: true,
                                shippingGroupId: this.props.shippingGroupId,
                                ...(isNCR && {
                                    replacementOrderId: orderId
                                })
                            };
                            updateAddressApi(dataToSend).then(this.sectionSaved).catch(this.handleResponseError);
                        },
                        // When user clicks EDIT ADDRESS for unverified modal
                        UNVERIFIED: () => {
                            addressData.isDefault = isDefaultAddress;
                            this.showEditShipAddressForm(addressData);
                            increaseSessionAddressValidationCount();
                        }
                    },
                    // When user decides to use the unverified address or when closing the modal
                    () => {
                        increaseSessionAddressValidationCount();

                        const dataToSend = {
                            address: Object.assign({}, addressData),
                            isDefaultAddress,
                            addressValidated: false,
                            shippingGroupId: this.props.shippingGroupId,
                            ...(isNCR && {
                                replacementOrderId: orderId
                            })
                        };
                        updateAddressApi(dataToSend).then(this.sectionSaved).catch(this.handleResponseError);
                    },
                    pageType
                );
            })
            .catch(this.handleResponseError);
    };

    sectionSaved = () => {
        const { isNCR } = this.props;

        if (!isNCR) {
            this.props.saveAddress(this, false);
        }

        processEvent.process(anaConsts.ADD_SHIPPINGINFO_EVENT, {
            data: {}
        });
    };

    handleResponseError = errorData => {
        if (this.props.isSdd) {
            errorData.sameDay = true;
            const errors = setErrorsFromCheckoutAPI(errorData);
            this.setAnalyticsAndErrors(SECTION_NAMES.SDD, errors);
        }

        const errors = FrictionlessUtils.setDeliverToErrors(errorData.errorMessages?.join(' '));
        this.props.setCheckoutSectionErrors(errors);

        ErrorsUtils.collectAndValidateBackEndErrors(errorData, this);
    };

    componentWillUnmount() {
        unsubscribe();
    }

    handleShowEditShipAddressForm = address => () => {
        this.showEditShipAddressForm(address);
    };

    handleSetNewShippingAddress = address => () => {
        this.setNewShippingAddress(address, true);
    };

    render() {
        const {
            shippingAddress,
            shippingGroupId,
            profileAddresses,
            isNewUserFlow,
            orderHasPhysicalGiftCard,
            isGuestCheckout,
            isHalAvailable,
            isNCR,
            taxExemptAddressLabel,
            removeAddressLabel,
            remove,
            editAddressLabel,
            edit,
            addShippingAddress,
            showMoreAddresses,
            showLessAddresses,
            children,
            shippingMessage,
            isComplete,
            isSdd,
            isGiftCardSection,
            isCollapsed
        } = this.props;

        const { openAddressForm, addressesToDisplay, currentShipAddressId, editAddress } = this.state;

        const displayedShipAddresses = profileAddresses && profileAddresses.slice(0, addressesToDisplay);
        const showTaxExemptAddress = this.props.showTaxExemptAddress && TaxClaimUtils.isTaxExemptionEnabled();

        return (
            <div>
                {orderHasPhysicalGiftCard && !isComplete && (
                    <Text
                        is='p'
                        children={shippingMessage}
                        marginBottom={4}
                    />
                )}
                {isNewUserFlow || profileAddresses.length === 0 ? (
                    <ShipAddressForm
                        address={shippingAddress}
                        shippingGroupId={shippingGroupId}
                        isNewUser={isNewUserFlow}
                        isFirstAddress={true}
                        isDefaultChecked={true}
                        orderHasPhysicalGiftCard={orderHasPhysicalGiftCard}
                        isGuestCheckout={isGuestCheckout}
                        isHalAvailable={isHalAvailable}
                        isSdd={isSdd}
                        hasUserOpenedAddressForm={false}
                        isGiftCardSection={isGiftCardSection}
                        isCollapsed={isCollapsed}
                    >
                        {children}
                    </ShipAddressForm>
                ) : (
                    <div>
                        {openAddressForm ? (
                            <ShipAddressForm
                                address={editAddress}
                                shippingGroupId={shippingGroupId}
                                cancelCallback={this.closeAddressForm}
                                isDefaultChecked={editAddress && editAddress.isDefault}
                                isHalAvailable={isHalAvailable}
                                isNCR={isNCR}
                                isSdd={isSdd}
                                hasUserOpenedAddressForm={true}
                                isGiftCardSection={isGiftCardSection}
                                isCollapsed={isCollapsed}
                            >
                                {children}
                            </ShipAddressForm>
                        ) : (
                            <React.Fragment>
                                {displayedShipAddresses.map((address, index) => (
                                    <div
                                        data-at={Sephora.debug.dataAt('shippingAddress')}
                                        ref={`shipAddress${index}`}
                                        key={address.addressId}
                                    >
                                        <div
                                            css={{
                                                ...(isNCR && {
                                                    [mediaQueries.sm]: {
                                                        marginBottom: space[4],
                                                        display: 'flex',
                                                        alignItems: 'baseline',
                                                        justifyContent: 'space-between'
                                                    }
                                                })
                                            }}
                                            data-at={Sephora.debug.dataAt('shipping_address_display')}
                                        >
                                            <Radio
                                                name='shipAddressOption'
                                                checked={currentShipAddressId === address.addressId}
                                                onClick={this.handleSetNewShippingAddress(address)}
                                            >
                                                {address && (
                                                    <Address
                                                        address={address}
                                                        isEditShippingOnCheckout
                                                        isHalAddress={isHalAddress(address)}
                                                    />
                                                )}
                                                {showTaxExemptAddress && TaxClaimUtils.isTaxExemptAddress(address) && (
                                                    <Box
                                                        display='inline-flex'
                                                        backgroundColor='black'
                                                        borderRadius={2}
                                                        paddingX={2}
                                                        marginTop={4}
                                                        alignContent='center'
                                                        width='auto'
                                                    >
                                                        <Text
                                                            color='white'
                                                            fontWeight={700}
                                                            fontSize={'xs'}
                                                            display='inline-block'
                                                        >
                                                            {taxExemptAddressLabel}
                                                        </Text>
                                                    </Box>
                                                )}
                                            </Radio>
                                            {!isHalAddress(address) && !(showTaxExemptAddress && TaxClaimUtils.isTaxExemptAddress(address)) && (
                                                <Flex
                                                    marginBottom={isNCR && 4}
                                                    marginLeft={forms.RADIO_SIZE + forms.RADIO_MARGIN + 'px'}
                                                >
                                                    {!isNCR && (
                                                        <>
                                                            <Link
                                                                aria-label={removeAddressLabel}
                                                                padding={2}
                                                                margin={-2}
                                                                color='blue'
                                                                onClick={e => this.showRemoveShipAddressModalDebounce(address.addressId, e)}
                                                                data-at={Sephora.debug.dataAt('remove_address_btn')}
                                                            >
                                                                {remove}
                                                            </Link>
                                                            <Box
                                                                borderLeft={1}
                                                                marginX={3}
                                                                borderColor='divider'
                                                            />
                                                        </>
                                                    )}
                                                    <Link
                                                        aria-label={editAddressLabel}
                                                        aria-controls='ship_address_form'
                                                        padding={2}
                                                        margin={-2}
                                                        color='blue'
                                                        onClick={this.handleShowEditShipAddressForm(address)}
                                                    >
                                                        {edit}
                                                    </Link>
                                                </Flex>
                                            )}
                                        </div>
                                        {!isNCR && <Divider marginY={4} />}
                                    </div>
                                ))}
                                {isNCR && <Divider marginBottom={4} />}
                                <Link
                                    padding={3}
                                    margin={-3}
                                    fontWeight='bold'
                                    data-at={Sephora.debug.dataAt('addAddress')}
                                    onClick={this.showAddShipAddressForm}
                                >
                                    <Flex alignItems='center'>
                                        <IconCross fontSize={forms.RADIO_SIZE} />
                                        <Text marginLeft={forms.RADIO_MARGIN + 'px'}>{addShippingAddress}</Text>
                                    </Flex>
                                </Link>

                                {children}

                                {profileAddresses.length > 3 && (
                                    <div>
                                        <Divider marginY={4} />
                                        <Link
                                            color='blue'
                                            paddingY={2}
                                            marginY={-2}
                                            data-at={Sephora.debug.dataAt('addressShowMore')}
                                            onClick={
                                                addressesToDisplay < profileAddresses.length ? this.handleShowMoreOnClick : this.handleShowLessOnClick
                                            }
                                        >
                                            {addressesToDisplay < profileAddresses.length ? showMoreAddresses : showLessAddresses}
                                        </Link>
                                    </div>
                                )}
                                {!isNCR && <AccordionButton onClick={this.saveAndContinueDebounce} />}
                            </React.Fragment>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

export default wrapComponent(ShipAddressSection, 'ShipAddressSection');
