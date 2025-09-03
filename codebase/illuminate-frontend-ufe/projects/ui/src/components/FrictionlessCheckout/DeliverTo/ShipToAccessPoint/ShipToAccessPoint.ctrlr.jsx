/* eslint-disable complexity */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Text, Grid, Link, Divider, Box, Flex
} from 'components/ui';
import FormValidator from 'utils/FormValidator';
import AccordionButton from 'components/FrictionlessCheckout/LayoutCard/AccordionButton';
import TextInput from 'components/Inputs/TextInput/TextInput';
import InputEmail from 'components/Inputs/InputEmail/InputEmail';
import Debounce from 'utils/Debounce';
import localeUtils from 'utils/LanguageLocale';
import Select from 'components/Inputs/Select/Select';
import HelperUtils from 'utils/Helpers';
import ErrorConstants from 'utils/ErrorConstants';
import ErrorsUtils from 'utils/Errors';
import utilityApi from 'services/api/utility';
import addressUtils from 'utils/Address';
import {
    mediaQueries, colors, radii, space
} from 'style/config';
import Markdown from 'components/Markdown/Markdown';

const { getCurrentCountry } = localeUtils;
const PHONE_NUMBER = 'phoneNumber';
const POSTAL_CODE = 'postalCode';
const country = getCurrentCountry();

class ShipToAccessPoint extends BaseClass {
    state = {
        pickupPerson: {
            firstName: null,
            lastName: null,
            phoneNumber: null,
            email: null,
            addressLine1: null,
            addressLine2: null,
            city: null,
            state: null,
            postalCode: null,
            country: null
        },
        statesList: [],
        showCityAndState: false,
        invalidPostalCode: false
    };

    saveAndContinue = event => {
        event?.preventDefault();
        const isFormValid = this.validateForm();
        const {
            shippingGroupId, shippingAddress, isGuestCheckout, createShippingAddress, isCanada
        } = this.props;
        const { pickupPerson } = this.state;

        const halAddressPayload = {
            shippingGroupId: shippingGroupId,
            addressType: shippingAddress?.addressType,
            address: {
                firstName: pickupPerson?.firstName,
                lastName: pickupPerson?.lastName,
                phone: pickupPerson?.phoneNumber,
                address1: shippingAddress?.address1,
                city: shippingAddress?.city,
                state: shippingAddress?.state,
                postalCode: shippingAddress?.postalCode,
                country: shippingAddress?.country,
                altPickLocationID: shippingAddress?.altPickLocationID,
                altPickLocationType: shippingAddress?.altPickLocationType,
                altPickLocationPartner: shippingAddress?.altPickLocationPartner,
                altLocationPhone: shippingAddress?.altLocationPhone,
                halCompany: shippingAddress?.halCompany
            }
        };

        if (isCanada) {
            halAddressPayload.address = {
                ...halAddressPayload.address,
                pickUpPersonAddress1: pickupPerson?.addressLine1,
                pickUpPersonAddress2: pickupPerson?.addressLine2,
                pickUpPersonCity: pickupPerson?.city,
                pickUpPersonState: pickupPerson?.state,
                postalCode: pickupPerson?.postalCode
            };
        }

        const currentHalAddress = {
            ...halAddressPayload.address,
            address2: '',
            addressType: halAddressPayload.addressType,
            addressId: shippingAddress?.altPickLocationID
        };

        if (isGuestCheckout) {
            halAddressPayload.address.shipEmail = pickupPerson?.email;
        }

        if (isFormValid) {
            createShippingAddress(halAddressPayload, currentHalAddress, this);
        }
    };

    debouncedSaveAndContinue = Debounce.preventDoubleClick(this.saveAndContinue);

    validateForm = () => {
        ErrorsUtils.clearErrors();
        const { isGuestCheckout } = this.props;
        const fieldsForValidation = [
            this.firstNameInput,
            this.lastNameInput,
            this.phoneNumberInput,
            this.addressLine1Input,
            this.postalCodeInput,
            this.cityInput,
            this.stateSelect
        ];

        if (isGuestCheckout) {
            fieldsForValidation.push(this.emailInput);
        }

        ErrorsUtils.collectClientFieldErrors(fieldsForValidation);

        return !ErrorsUtils.validate(fieldsForValidation);
    };

    updatePickupPerson = event => {
        const name = event.target.name;
        let value = event.target.value;

        if (name === PHONE_NUMBER) {
            value = value.replace(HelperUtils.specialCharacterRegex, '');
        }

        const pickupPerson = {
            ...this.state.pickupPerson,
            [name]: value
        };

        this.setState({ pickupPerson });
    };

    handlePostalCode = async event => {
        let postalCode = event.target.value;
        postalCode = addressUtils.formatZipPostalCode(postalCode.toUpperCase(), ' ', 3, 6);

        const nextState = {
            pickupPerson: {
                ...this.state.pickupPerson,
                [POSTAL_CODE]: postalCode
            }
        };

        //if postalCode has valid length make getStateAndCityForZipCode call
        //if user removes part of valid postalCode, reset state and city inputs
        if (postalCode?.length === 7) {
            try {
                const zipCodeData = await utilityApi.getStateAndCityForZipCode(country, postalCode);

                nextState.pickupPerson.city = zipCodeData.city;
                nextState.pickupPerson.state = zipCodeData.state;
                nextState.showCityAndState = true;
            } catch (e) {
                nextState.invalidPostalCode = true;
                nextState.pickupPerson.city = null;
                nextState.pickupPerson.state = null;
                nextState.showCityAndState = false;
            }
        } else {
            nextState.pickupPerson.city = null;
            nextState.pickupPerson.state = null;
            nextState.invalidPostalCode = false;
            nextState.showCityAndState = false;
        }

        this.setState(nextState);
    };

    initPickupPersonData = () => {
        const { shippingAddress, user } = this.props;

        this.setState({
            pickupPerson: {
                firstName: shippingAddress?.firstName || user?.firstName,
                lastName: shippingAddress?.lastName || user?.lastName,
                phoneNumber: shippingAddress?.phone || user?.phoneNumber,
                email: shippingAddress?.email,
                addressLine1: shippingAddress?.pickUpPersonAddress1,
                addressLine2: shippingAddress?.pickUpPersonAddress2,
                city: shippingAddress?.pickUpPersonCity,
                state: shippingAddress?.pickUpPersonState,
                postalCode: shippingAddress?.pickUpPersonPostalCode
            }
        });
    };

    getStatesList = (showCityAndState = false) => {
        const { getStateList } = this.props;

        getStateList(country, statesList => {
            // remove option 0 - 'select a province' from API response
            this.setState({ statesList: statesList.slice(1), showCityAndState });
        });
    };

    componentDidMount() {
        this.initPickupPersonData();
        this.getStatesList();
    }

    componentWillReceiveProps(nextProps) {
        const { editMode, isCanada, shippingAddress } = this.props;

        // Only enter this flow when we change from
        // editMode = false to editMode = true
        if (!editMode && nextProps.editMode) {
            this.initPickupPersonData();

            if (isCanada) {
                // Show the City and Province inputs when
                // entering edit mode. Postal Code must be
                // part of the shippingAddress at this point.
                const showCityAndState = Boolean(shippingAddress?.pickUpPersonPostalCode);
                this.getStatesList(showCityAndState);
            }
        }
    }

    handleResetAccessPoint = () => {
        const { resetAccessPoint } = this.props;

        resetAccessPoint(true);
    };

    handleValidateFirstName = firstName => {
        if (FormValidator.isEmpty(firstName)) {
            return ErrorConstants.ERROR_CODES.FIRST_NAME;
        }

        return null;
    };

    handleValidateLastName = lastName => {
        if (FormValidator.isEmpty(lastName)) {
            return ErrorConstants.ERROR_CODES.LAST_NAME;
        }

        return null;
    };

    handleValidatePhoneNumber = phoneNumber => {
        if (FormValidator.isEmpty(phoneNumber)) {
            return ErrorConstants.ERROR_CODES.PHONE_NUMBER;
        }

        if (phoneNumber.length && !FormValidator.isValidPhoneNumber(phoneNumber)) {
            return ErrorConstants.ERROR_CODES.PHONE_NUMBER_INVALID;
        }

        return null;
    };

    handelValidateStreetAddressLine1 = addressLine1 => {
        if (FormValidator.isEmpty(addressLine1)) {
            return ErrorConstants.ERROR_CODES.ADDRESS1;
        }

        return null;
    };

    handleValidateStreetAddressLine2 = addressLine2 => {
        if (!FormValidator.isValidLength(addressLine2, 0, FormValidator.FIELD_LENGTHS.address)) {
            return ErrorConstants.ERROR_CODES.ADDRESS1_LONG;
        }

        return null;
    };

    handleValidatePostalCode = postalCodeValue => {
        const { invalidPostalCode } = this.state;

        if (FormValidator.isEmpty(postalCodeValue)) {
            return ErrorConstants.ERROR_CODES.ZIP_CODE_NON_US;
        } else if (!FormValidator.isValidZipCode(postalCodeValue, country) || invalidPostalCode) {
            return ErrorConstants.ERROR_CODES.INVALID_ZIP_CODE;
        }

        return null;
    };

    handleValidateCity = cityValue => {
        if (FormValidator.isEmpty(cityValue)) {
            return ErrorConstants.ERROR_CODES.CITY;
        } else if (!FormValidator.isValidLength(cityValue, 1, FormValidator.FIELD_LENGTHS.city)) {
            return ErrorConstants.ERROR_CODES.CITY_LONG;
        }

        return null;
    };

    editPickuPerson = () => {
        this.props.callback(true);
    };

    render() {
        const { editMode, isGuestCheckout, localization, isCanada } = this.props;

        const {
            pickupPerson: pickupPersonLabel,
            idRequired,
            idRequiredEditMode,
            firstName: firstNameLabel,
            lastName: lastNameLabel,
            email: emailLabel,
            emailRequiredText,
            phoneNumber,
            shipToAddress,
            streetAddress,
            addressLine2,
            postalCode: postalCodeLabel,
            invalidPostalCode: invalidPostalCodeLabel,
            enterPostalCode,
            city: cityLabel,
            province
        } = localization;

        const { pickupPerson, invalidPostalCode, showCityAndState, statesList } = this.state;
        const fullNameCaptured = Boolean(pickupPerson?.firstName && pickupPerson.lastName);
        const idRequiredText = editMode ? idRequiredEditMode : idRequired;

        return (
            <Box marginTop={4}>
                {!editMode && fullNameCaptured && <Divider marginBottom={4} />}
                <Flex justifyContent='space-between'>
                    <Text
                        display='block'
                        fontWeight='bold'
                        fontSize={['base', 'md']}
                    >
                        {pickupPersonLabel}
                    </Text>
                    {!editMode && (
                        <Link
                            color='blue'
                            lineHeight='tight'
                            children={'Edit'}
                            onClick={this.editPickuPerson}
                        />
                    )}
                </Flex>
                {!editMode && fullNameCaptured && (
                    <>
                        <Text
                            is='p'
                            fontSize={'base'}
                            lineHeight={1.3}
                            marginTop={3}
                        >
                            {pickupPerson?.firstName} {pickupPerson?.lastName}
                        </Text>
                        {!isCanada && (
                            <Text
                                is='p'
                                lineHeight={1.3}
                                fontSize={'base'}
                            >
                                {FormValidator.getFormattedPhoneNumber(pickupPerson?.phoneNumber)}
                            </Text>
                        )}
                        {isCanada && (
                            <>
                                <Text
                                    is='p'
                                    fontSize={'base'}
                                    lineHeight={1.3}
                                >
                                    {pickupPerson?.addressLine1}
                                </Text>
                                <Text
                                    is='p'
                                    lineHeight={1.3}
                                    fontSize={'base'}
                                >
                                    {pickupPerson?.city}, {pickupPerson?.state} {pickupPerson.postalCode}{' '}
                                </Text>
                            </>
                        )}
                        {isGuestCheckout && pickupPerson?.email && (
                            <Text
                                is='p'
                                fontSize={'base'}
                                lineHeight={1.3}
                            >
                                {pickupPerson?.email}
                            </Text>
                        )}
                    </>
                )}
                <Box css={[!editMode && fullNameCaptured && styles.requiredTextContainer]}>
                    <Markdown
                        fontSize={['sm', 'base']}
                        lineHeight={['1.2', '1.5']}
                        content={editMode ? idRequiredText.replace(/\*/g, '') : idRequiredText}
                    />
                </Box>

                {editMode && (
                    <>
                        <Grid
                            columns={[1, 1, 2]}
                            gap={4}
                            paddingTop={4}
                            marginBottom={4}
                        >
                            <TextInput
                                name='firstName'
                                marginBottom={null}
                                required={true}
                                label={firstNameLabel}
                                value={pickupPerson?.firstName}
                                onChange={this.updatePickupPerson}
                                maxLength={FormValidator.FIELD_LENGTHS.name}
                                ref={comp => (this.firstNameInput = comp)}
                                validateError={this.handleValidateFirstName}
                            />
                            <TextInput
                                name='lastName'
                                marginBottom={null}
                                required={true}
                                label={lastNameLabel}
                                value={pickupPerson?.lastName}
                                onChange={this.updatePickupPerson}
                                maxLength={FormValidator.FIELD_LENGTHS.name}
                                ref={comp => (this.lastNameInput = comp)}
                                validateError={this.handleValidateLastName}
                            />
                            {isGuestCheckout && (
                                <InputEmail
                                    marginBottom={null}
                                    required={true}
                                    label={emailLabel}
                                    infoText={emailRequiredText}
                                    name='email'
                                    onChange={this.updatePickupPerson}
                                    login={pickupPerson?.email}
                                    ref={comp => (this.emailInput = comp)}
                                />
                            )}
                            <TextInput
                                name={PHONE_NUMBER}
                                type='tel'
                                autoComplete='tel'
                                autoCorrect='off'
                                required={true}
                                marginBottom={null}
                                label={phoneNumber}
                                value={
                                    pickupPerson?.phoneNumber?.length > 3
                                        ? FormValidator.getFormattedPhoneNumber(pickupPerson?.phoneNumber)
                                        : pickupPerson?.phoneNumber
                                }
                                maxLength={FormValidator.FIELD_LENGTHS.formattedPhone}
                                onKeyDown={!Sephora.isTouch && FormValidator.inputAcceptOnlyNumbers}
                                onPaste={FormValidator.pasteAcceptOnlyNumbers}
                                onChange={this.updatePickupPerson}
                                ref={comp => (this.phoneNumberInput = comp)}
                                validateError={this.handleValidatePhoneNumber}
                            />
                            {isCanada && (
                                <>
                                    <TextInput
                                        name='addressLine1'
                                        marginBottom={null}
                                        required={true}
                                        label={streetAddress}
                                        value={pickupPerson?.addressLine1}
                                        onChange={this.updatePickupPerson}
                                        maxLength={FormValidator.FIELD_LENGTHS.address}
                                        ref={comp => (this.addressLine1Input = comp)}
                                        validateError={this.handelValidateStreetAddressLine1}
                                        customStyle={styles.addressInput}
                                    />
                                    <TextInput
                                        name='addressLine2'
                                        marginBottom={null}
                                        label={addressLine2}
                                        value={pickupPerson?.addressLine2}
                                        onChange={this.updatePickupPerson}
                                        maxLength={FormValidator.FIELD_LENGTHS.address}
                                        ref={comp => (this.addressLine2Input = comp)}
                                        validateError={this.handleValidateStreetAddressLine2}
                                        customStyle={styles.addressInput}
                                    />
                                    <Grid
                                        columns={2}
                                        css={styles.postalCode}
                                    >
                                        <TextInput
                                            name={POSTAL_CODE}
                                            required={true}
                                            marginBottom={null}
                                            label={postalCodeLabel}
                                            value={pickupPerson?.postalCode}
                                            onChange={this.handlePostalCode}
                                            maxLength={FormValidator.FIELD_LENGTHS.postalCode}
                                            ref={comp => (this.postalCodeInput = comp)}
                                            invalid={invalidPostalCode}
                                            message={invalidPostalCode && invalidPostalCodeLabel}
                                            validateError={this.handleValidatePostalCode}
                                        />
                                        {!showCityAndState && (
                                            <Text
                                                marginTop={1}
                                                fontSize='sm'
                                            >
                                                {enterPostalCode}
                                            </Text>
                                        )}
                                    </Grid>
                                    <div />
                                    {showCityAndState && (
                                        <>
                                            <TextInput
                                                name='city'
                                                marginBottom={null}
                                                required={true}
                                                label={cityLabel}
                                                value={pickupPerson?.city}
                                                onChange={this.updatePickupPerson}
                                                maxLength={FormValidator.FIELD_LENGTHS.city}
                                                ref={comp => (this.cityInput = comp)}
                                                validateError={this.handleValidateCity}
                                            />
                                            <Select
                                                label={province}
                                                name='state'
                                                value={pickupPerson?.state}
                                                required={true}
                                                onChange={this.updatePickupPerson}
                                                ref={comp => (this.stateSelect = comp)}
                                            >
                                                {statesList.map(stateItem => (
                                                    <option
                                                        key={stateItem.name}
                                                        value={stateItem.name}
                                                        children={stateItem.description}
                                                    />
                                                ))}
                                            </Select>
                                        </>
                                    )}
                                </>
                            )}
                        </Grid>
                        <Link
                            padding={2}
                            margin={-2}
                            color='blue'
                            display='block'
                            onClick={this.handleResetAccessPoint}
                        >
                            {shipToAddress}
                        </Link>
                        <AccordionButton
                            customStyle={styles}
                            onClick={this.debouncedSaveAndContinue}
                        />
                    </>
                )}
            </Box>
        );
    }
}

const styles = {
    addressInput: {
        root: {
            [mediaQueries.md]: {
                display: 'grid',
                gridColumnStart: 1,
                gridColumnEnd: 3
            }
        }
    },
    requiredTextContainer: {
        backgroundColor: colors.nearWhite,
        borderRadius: radii[2] + 'px',
        padding: `${space[2]}px ${space[3]}px`,
        marginTop: space[2] + 'px'
    },

    button: {
        width: '48%',
        maxWidth: 224
    },

    postalCode: {
        [mediaQueries.smMax]: {
            marginBottom: -space[4]
        }
    }
};

ShipToAccessPoint.defaultProps = {
    shippingAddress: {},
    isCanada: false
};

export default wrapComponent(ShipToAccessPoint, 'ShipToAccessPoint', true);
