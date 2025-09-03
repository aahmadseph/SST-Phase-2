import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Box, Grid, Text, Link, Flex
} from 'components/ui';
import IconCross from 'components/LegacyIcon/IconCross';
import { fontSizes, fontWeights, colors } from 'style/config';
import AddressPicker from 'components/AddressPicker';
import TaxExemption from 'components/RichProfile/MyAccount/TaxClaim/TaxExemption';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import localeUtils from 'utils/LanguageLocale';
import AddressForm from 'components/RichProfile/MyAccount/TaxClaim/AddressForm';
import TaxFormValidator from 'components/RichProfile/MyAccount/TaxClaim/utils/TaxFormValidator';
import AddressActions from 'actions/AddressActions';
import userUtils from 'utils/User';
import { TaxClaimAddressValues } from 'components/RichProfile/MyAccount/TaxClaim/constants';

class TaxAddress extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            selectedAddressId: '',
            taxExemptionSelection: null,
            addAddress: false,
            showAddressSection: false,
            addressList: [],
            setDefaultAddress: false,
            updateList: false
        };
    }

    componentDidMount() {
        this.props.handleAddAddressChange(false);
        const profileId = userUtils.getProfileId();
        this.getAddresses(profileId);
    }

    getAddresses = profileId => {
        try {
            AddressActions.getSavedAddresses(profileId, this.setAddresses);
        } catch {
            this.setState({ addAddress: true, showAddressSection: true }, this.props.handleAddAddressChange(true));
        }
    };

    setAddresses = addresses => {
        if (!addresses.length) {
            this.setState({ addAddress: true }, this.props.handleAddAddressChange(true));
        }

        this.setState({ showAddressSection: true });
        this.setState({ addressList: addresses });
        this.setState({ updateList: !this.state.updateList });
    };

    renderForm = props => {
        return (
            <>
                <Link
                    color='blue'
                    padding={1}
                    onClick={this.handleAddAddress}
                >
                    <Text>{props.existingAddressLabel}</Text>
                </Link>

                <AddressForm
                    updateStep4Data={props.updateStep4Data}
                    firstName={props.firstName}
                    lastName={props.lastName}
                    phoneNumber={props.phoneNumber}
                    country={localeUtils.getCurrentCountry().toUpperCase()}
                    selectedCategory={props.selectedCategory}
                    addressErrors={props.taxAddressFormErrors}
                    handleStreetAddressChange={props.handleStreetAddressChange}
                    handleAddress2Change={props.handleAddress2Change}
                    handleCityChange={props.handleCityChange}
                    handleStateChange={props.handleStateChange}
                    handlePostalCodeChange={props.handlePostalCodeChange}
                    addAddressErrors={props.addAddressErrors}
                />
            </>
        );
    };

    renderSelection = props => {
        const missingAddressIdError = props.taxAddressFormErrors.includes(TaxFormValidator.VALIDATION_CONSTANTS.TAX_EXEMPTION_ADDRESS_ID_EMPTY);

        return (
            <>
                {missingAddressIdError ? (
                    <Text
                        css={styles.error}
                        role='alert'
                        aria-live='assertive'
                    >
                        {props.taxExemptionMissingSelection}
                    </Text>
                ) : null}

                <AddressPicker
                    key={this.state.updateList}
                    onRadioChange={this.handleRadioChange}
                    formErrors={props.taxAddressFormErrors}
                    selectedAddressId={this.state.selectedAddressId}
                    showDefault
                />

                <Link
                    padding={2}
                    margin={-2}
                    onClick={this.handleAddAddress}
                >
                    <Flex alignItems='center'>
                        <IconCross fontSize='md' />
                        <Text marginLeft={2}>{props.addAddressLabel}</Text>
                    </Flex>
                </Link>
            </>
        );
    };

    handleRadioChange = selectedAddressId => {
        const selectedCategory = this.props.selectedCategory.toLowerCase();
        const {
            ADDRESS1, ADDRESS2, CITY, STATE, POSTAL_CODE
        } = TaxClaimAddressValues;
        const {
            address1, address2, city, state, postalCode
        } = this.state.addressList.find(address => address.addressId === selectedAddressId);
        this.setState({ selectedAddressId }, this.props.handleAddressIdChange(selectedAddressId));
        this.props.handleStreetAddressChange(address1);
        this.props.updateStep4Data(selectedCategory, ADDRESS1, address1);
        this.props.handleAddress2Change(address2);
        this.props.updateStep4Data(selectedCategory, ADDRESS2, address2);
        this.props.handleStateChange(state);
        this.props.updateStep4Data(selectedCategory, STATE, state);
        this.props.handleCityChange(city);
        this.props.updateStep4Data(selectedCategory, CITY, city);
        this.props.handlePostalCodeChange(postalCode);
        this.props.updateStep4Data(selectedCategory, POSTAL_CODE, postalCode);
    };

    handleSelection = value => {
        this.setState({ taxExemptionSelection: value }, this.props.onSelection(value));
    };

    handleAddAddress = () => {
        this.setState({ addAddress: !this.state.addAddress }, this.props.handleAddAddressChange(!this.state.addAddress));
    };

    handleSetDefaultAddress = () => {
        this.setState({ setDefaultAddress: !this.state.setDefaultAddress }, this.props.handleSetDefaultAddressChange(!this.state.setDefaultAddress));
    };

    setDefaultAddressCall = async () => {
        try {
            await this.props.setDefaultShippingAddress(this.state.selectedAddressId);
            const profileId = userUtils.getProfileId();
            await AddressActions.getSavedAddresses(profileId, this.setAddresses);
        } catch (error) {
            this.setState({ addAddress: true, showAddressSection: true }, this.props.handleAddAddressChange(true));
        }
    };

    render() {
        const { taxExemptAddress, taxExemptAddressSubtitle, taxAddressFormErrors, taxExemptionSelection } = this.props;
        const { addAddress, addressId, selectedAddressId, addressList } = this.state;
        const shouldShowCheck = Boolean(addressId);
        const selectedAddress = addressList?.find(address => address.addressId === selectedAddressId);
        const isDefault = selectedAddress?.isDefault;
        const disableCheckbox = !addAddress && (isDefault || !selectedAddressId);

        return (
            <Grid
                marginTop={5}
                gap={3}
            >
                <TaxExemption
                    onSelection={this.handleSelection}
                    formErrors={taxAddressFormErrors}
                    taxExemptionSelection={taxExemptionSelection}
                />

                {this.state.showAddressSection ? (
                    taxExemptionSelection ? (
                        <>
                            <Box>
                                <Text
                                    is='h1'
                                    css={styles.subhead}
                                    marginBottom='8px'
                                >
                                    {taxExemptAddress}
                                </Text>
                                <Text
                                    is='p'
                                    css={styles.subtitle}
                                >
                                    {taxExemptAddressSubtitle}
                                </Text>
                            </Box>

                            {addAddress ? this.renderForm(this.props) : this.renderSelection(this.props)}
                            <Checkbox
                                checked={this.state.addAddress ? this.state.setDefaultAddress : shouldShowCheck}
                                onClick={this.state.addAddress ? this.handleSetDefaultAddress : this.setDefaultAddressCall}
                                disabled={disableCheckbox}
                            >
                                {this.props.taxClaimGetText('setDefaultAddress')}
                            </Checkbox>
                        </>
                    ) : null
                ) : null}
            </Grid>
        );
    }
}

const styles = {
    subhead: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.bold
    },
    subtitle: {
        fontSize: fontSizes.base,
        fontWeight: fontWeights.normal
    },
    error: {
        fontSize: fontSizes.base,
        color: colors.red
    }
};

export default wrapComponent(TaxAddress, 'TaxAddress', true);
