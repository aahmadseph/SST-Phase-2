import React from 'react';
import watch from 'redux-watch';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import AccountLayout from 'components/RichProfile/MyAccount/AccountLayout/AccountLayout';
import {
    Box, Flex, Text, Divider, Link
} from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import IconCross from 'components/LegacyIcon/IconCross';
import AcctAddressForm from 'components/RichProfile/MyAccount/Addresses/AcctAddressForm/AcctAddressForm';
import PleaseSignInBlock from 'components/RichProfile/MyAccount/PleaseSignIn';
import localeUtils from 'utils/LanguageLocale';
import Address from 'components/Addresses/Address';
import store from 'Store';
import AddressActions from 'actions/AddressActions';
import actions from 'actions/Actions';
import sessionExtensionService from 'services/SessionExtensionService';
import errorsUtils from 'utils/Errors';
import addressesUtils from 'utils/Address';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import { withEnsureUserIsSignedIn } from 'hocs/withEnsureUserIsSignedIn';
import TaxClaimUtils from 'utils/TaxClaim';

const getText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/Addresses/locales', 'Addresses');
const maxShippingAddress = Sephora.configurationSettings.maxShippingAddress;
const { hasAVS } = addressesUtils;

class Addresses extends BaseClass {
    state = {
        isUserReady: false,
        user: {},
        addresses: [],
        isAddAddress: false,
        isEditMode: false,
        editAddressId: ''
    };

    componentDidMount() {
        // subscribe to user to update name, email, or password display
        const userWatch = watch(store.getState, 'user');
        store.subscribe(
            userWatch(watchedUser => {
                if (this.state.user.profileId !== watchedUser.profileId) {
                    this.setState({
                        user: watchedUser,
                        isUserReady: true
                    });
                    this.setShippingCountryList(watchedUser);
                }
            }),
            this
        );
    }

    setShippingCountryList = user => {
        this.profileId = user.profileId;
        AddressActions.getSavedAddresses(this.profileId, this.setSavedAddresses);

        AddressActions.getShippingCountriesList(countryList => {
            this.setState({ countryList: countryList });
        });
        Sephora.isDesktop() && sessionExtensionService.setExpiryTimer(this.props.requestCounter);
    };

    setSavedAddresses = addresses => {
        this.setState({ addresses });

        AddressActions.updateDefaultShippingAddressData(addresses);

        return addresses;
    };

    chooseDefaultAddress = addressId => {
        AddressActions.setDefaultAddress(addressId, this.profileId, this.setSavedAddresses).then(addresses =>
            this.validateAddress(addresses, addressId)
        );
    };

    deleteSavedAddressCallback = () => {
        this.setState({
            isEditMode: false,
            editAddressId: ''
        });
        AddressActions.getSavedAddresses(this.profileId, this.setSavedAddresses);
    };

    showAddAddressForm = () => {
        if (this.state.addresses.length < maxShippingAddress) {
            this.setState({
                isAddAddress: !this.state.isAddAddress,
                isEditMode: false
            });
        } else {
            const title = getText('title');
            const message = getText('message');
            const buttonText = getText('buttonText');
            store.dispatch(
                actions.showInfoModal({
                    isOpen: true,
                    title: title,
                    message: message,
                    buttonText: buttonText
                })
            );
        }
    };

    showEditAddress = addressId => {
        this.setState({
            isEditMode: true,
            isAddAddress: false,
            editAddressId: addressId
        });
    };

    addAddressCallback = addressData => {
        this.setState({ isAddAddress: false });
        AddressActions.getSavedAddresses(this.profileId, this.setSavedAddresses).then(addresses => {
            this.validateAddress(addresses, addressData?.addressId);
        });
    };

    updateAddressCallback = shouldValidateAddress => {
        const addressId = this.state.editAddressId;
        this.setState({
            isEditMode: false,
            editAddressId: ''
        });
        AddressActions.getSavedAddresses(this.profileId, this.setSavedAddresses).then(addresses => {
            if (shouldValidateAddress) {
                this.validateAddress(addresses, addressId);
            }
        });
    };

    cancelAddAddressCallback = () => {
        this.setState({ isAddAddress: false });
    };

    cancelEditAddressCallback = () => {
        this.setState({
            isEditMode: false,
            editAddressId: ''
        });
    };

    validateAddressCallback = () => {
        AddressActions.getSavedAddresses(this.profileId, this.setSavedAddresses);
    };

    validateAddress = (addresses, addressId) => {
        const addressData = addressId && addresses.filter(address => address.addressId === addressId)[0];

        const maxAddressValidationCount = Storage.session.getItem(LOCAL_STORAGE.MAX_ADDRESS_VALIDATION_COUNT);
        const hasReachedMaxValidations = maxAddressValidationCount >= Sephora.configurationSettings.maxAddressValidationCount;

        // Do not validate in the following scenarios
        if (!hasAVS(addressData.country) || !addressData || hasReachedMaxValidations || addressData.isAddressVerified) {
            return;
        }

        // Clean the address details for API Calls
        const isDefaultAddress = addressData.isDefault;

        delete addressData.isAddressVerified;
        delete addressData.isDefault;
        delete addressData.formattedPhone;
        delete addressData.isPOBoxAddress;
        delete addressData.addressType;

        const updateAddress = optionParams => AddressActions.updateAddress(optionParams, this.validateAddressCallback, this.handleResponseError);

        // Call Validate API
        AddressActions.validateAddress(
            addressData,
            {
                // When users accepts the recommended address
                RECOMMENDED: (recommendedAddress = {}) => {
                    const recommendedIsPOBoxAddress = recommendedAddress.isPOBoxAddress;
                    const recommendedAddressType = recommendedAddress.addressType;

                    // Clean the recommendedAddress details for API Calls
                    delete recommendedAddress.isPOBoxAddress;
                    delete recommendedAddress.addressType;

                    const optionParams = {
                        address: Object.assign({}, addressData, recommendedAddress),
                        isPOBoxAddress: recommendedIsPOBoxAddress,
                        addressType: recommendedAddressType,
                        isDefaultAddress,
                        addressValidated: true
                    };
                    updateAddress(optionParams);
                },
                // When users clicks EDIT ADDRESS for unverified modal
                UNVERIFIED: () => this.showEditAddress(addressData.addressId)
            },
            // When user decides to use the unverified address or when closing the modal
            () => {
                const addressValidationCount = Storage.session.getItem(LOCAL_STORAGE.MAX_ADDRESS_VALIDATION_COUNT) + 1;
                Storage.session.setItem(LOCAL_STORAGE.MAX_ADDRESS_VALIDATION_COUNT, addressValidationCount);
                const optionParams = {
                    address: Object.assign({}, addressData),
                    isDefaultAddress,
                    addressValidated: false
                };
                updateAddress(optionParams);
            }
        );
    };

    handleResponseError = errorData => {
        errorsUtils.collectAndValidateBackEndErrors(errorData, this);
    };

    isUserAuthenticated = () => {
        return this.state.user && this.state.user.login;
    };

    deleteTaxAddressModalCallback = addressId => {
        AddressActions.deleteAddress(addressId, this.profileId, this.deleteSavedAddressCallback, this.handleResponseError);
    };

    showDeleteTaxExemptAddressModal = addressId => {
        store.dispatch(
            actions.showInfoModal({
                isOpen: true,
                showCancelButton: true,
                showCloseButton: true,
                title: getText('deleteTaxExemptAddresModalTitle'),
                message: getText('deleteTaxExemptAddresModalMessage'),
                buttonText: getText('yes'),
                cancelText: getText('no'),
                callback: () => this.deleteTaxAddressModalCallback(addressId)
            })
        );
    };

    createShowEditAddressHandler = addressId => {
        return e => {
            e.preventDefault();
            this.showEditAddress(addressId);
        };
    };

    createShowDeleteTaxExemptAddress = addressId => {
        return e => {
            e.preventDefault();
            this.showDeleteTaxExemptAddressModal(addressId);
        };
    };

    render() {
        return (
            <AccountLayout
                section='account'
                page='saved addresses'
                title={getText('savedAddresses')}
            >
                {!Sephora.isNodeRender && this.state.isUserReady && (
                    <div>
                        {!this.isUserAuthenticated() && <PleaseSignInBlock />}

                        {this.isUserAuthenticated() && (
                            <Box marginTop={5}>
                                {this.state.addresses && this.state.addresses.length
                                    ? this.state.addresses.map(
                                        address =>
                                            address.addressId.indexOf('sg') === 0 || (
                                                <div key={address.addressId}>
                                                    {this.state.isEditMode && address.addressId === this.state.editAddressId ? (
                                                        <div>
                                                            <AcctAddressForm
                                                                isEditMode
                                                                profileId={this.profileId}
                                                                address={address}
                                                                country={address.country}
                                                                countryList={this.state.countryList}
                                                                cancelEditAddressCallback={this.cancelEditAddressCallback}
                                                                updateAddressCallback={this.updateAddressCallback}
                                                                deleteSavedAddressCallback={this.deleteSavedAddressCallback}
                                                            />
                                                            <Divider marginY={5} />
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <LegacyGrid gutter={3}>
                                                                <LegacyGrid.Cell width='fill'>
                                                                    <Address address={address} />
                                                                    <Box marginTop={2}>
                                                                        {address.isDefault ? (
                                                                            <Text
                                                                                is='p'
                                                                                color='gray'
                                                                            >
                                                                                {getText('defaultShippingAddress')}
                                                                            </Text>
                                                                        ) : (
                                                                            <Checkbox onClick={() => this.chooseDefaultAddress(address.addressId)}>
                                                                                {getText('setAsDefaultAddress')}
                                                                            </Checkbox>
                                                                        )}
                                                                    </Box>
                                                                </LegacyGrid.Cell>
                                                                {TaxClaimUtils.isTaxExemptionEnabled() &&
                                                                      TaxClaimUtils.isTaxExemptAddress(address) && (
                                                                    <LegacyGrid.Cell width='fit'>
                                                                        <Flex
                                                                            backgroundColor='black'
                                                                            borderRadius={2}
                                                                            paddingX={2}
                                                                            alignItems='center'
                                                                        >
                                                                            <Text
                                                                                color='white'
                                                                                fontWeight={700}
                                                                                fontSize={'11px'}
                                                                            >
                                                                                {getText('taxExemptAddressLabel')}
                                                                            </Text>
                                                                        </Flex>
                                                                    </LegacyGrid.Cell>
                                                                )}
                                                                <LegacyGrid.Cell width='fit'>
                                                                    {TaxClaimUtils.isTaxExemptionEnabled() &&
                                                                      TaxClaimUtils.isTaxExemptAddress(address) ? (
                                                                            <Link
                                                                                color='blue'
                                                                                paddingY={2}
                                                                                marginY={-2}
                                                                                onClick={this.createShowDeleteTaxExemptAddress(address.addressId)}
                                                                            >
                                                                                {getText('delete')}
                                                                            </Link>
                                                                        ) : (
                                                                            <Link
                                                                                color='blue'
                                                                                paddingY={2}
                                                                                marginY={-2}
                                                                                onClick={this.createShowEditAddressHandler(address.addressId)}
                                                                                data-at={Sephora.debug.dataAt('saved_addresses_edit_button')}
                                                                            >
                                                                                {getText('edit')}
                                                                            </Link>
                                                                        )}
                                                                </LegacyGrid.Cell>
                                                            </LegacyGrid>
                                                            <Divider marginY={5} />
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                    )
                                    : null}
                                {!this.state.isAddAddress ? (
                                    <Link
                                        padding={2}
                                        margin={-2}
                                        onClick={this.showAddAddressForm}
                                        data-at={Sephora.debug.dataAt('saved_addresses_add_shipping_address_button')}
                                    >
                                        <Flex alignItems='center'>
                                            <IconCross fontSize='md' />
                                            <Text marginLeft={2}>{getText('addShippingAddress')}</Text>
                                        </Flex>
                                    </Link>
                                ) : (
                                    <AcctAddressForm
                                        isFirstAddress={this.state.addresses && this.state.addresses.length === 0}
                                        countryList={this.state.countryList}
                                        cancelAddAddressCallback={this.cancelAddAddressCallback}
                                        addAddressCallback={this.addAddressCallback}
                                        country={localeUtils.getCurrentCountry().toUpperCase()}
                                    />
                                )}
                            </Box>
                        )}
                    </div>
                )}
            </AccountLayout>
        );
    }
}

export const AddressesComponent = wrapComponent(Addresses, 'Addresses', true);

export default withEnsureUserIsSignedIn(AddressesComponent);
