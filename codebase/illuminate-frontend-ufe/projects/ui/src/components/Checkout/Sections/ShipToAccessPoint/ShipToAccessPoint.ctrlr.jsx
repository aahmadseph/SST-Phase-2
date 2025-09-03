/* eslint-disable complexity */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Box, Text, Grid, Link
} from 'components/ui';
import FormValidator from 'utils/FormValidator';
import UpdateError from 'components/Checkout/Shared/UpdateError';
import AccordionButton from 'components/Checkout/AccordionButton';
import TextInput from 'components/Inputs/TextInput/TextInput';
import InputEmail from 'components/Inputs/InputEmail/InputEmail';
import Select from 'components/Inputs/Select/Select';
import Debounce from 'utils/Debounce';
import localeUtils from 'utils/LanguageLocale';
import HelperUtils from 'utils/Helpers';
import ErrorConstants from 'utils/ErrorConstants';
import ErrorsUtils from 'utils/Errors';
import checkoutApi from 'services/api/checkout';
import utilityApi from 'services/api/utility';
import decorators from 'utils/decorators';
import { INTERSTICE_DELAY_MS } from 'components/Checkout/constants';
import Location from 'utils/Location';
import AccessPointButton from 'components/Checkout/Shared/AccessPointButton';
import addressUtils from 'utils/Address';
import { mediaQueries } from 'style/config';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import Empty from 'constants/empty';

import { getLocationHoursText } from 'utils/AccessPoints';

const { getCurrentCountry, getLocaleResourceFile } = localeUtils;
const getText = getLocaleResourceFile('components/Checkout/Sections/ShipToAccessPoint/locales', 'ShipToAccessPoint');
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
            sectionSaved, updateCurrentHalAddress, shippingGroupId, shippingAddress, isGuestCheckout, isCanada
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
                pickUpPersonPostalCode: pickupPerson?.postalCode
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
            decorators
                .withInterstice(
                    checkoutApi.createShippingAddress,
                    INTERSTICE_DELAY_MS
                )(halAddressPayload)
                .then(() => {
                    sectionSaved(Location.getLocation().pathname);
                    updateCurrentHalAddress(currentHalAddress);

                    processEvent.process(anaConsts.ADD_SHIPPINGINFO_EVENT, {
                        data: {}
                    });
                })
                .catch(errorData => {
                    ErrorsUtils.collectAndValidateBackEndErrors(errorData, this);
                });
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

    render() {
        const {
            editMode, isComplete, isGuestCheckout, order, shippingAddress, setAccessPoint, isCanada
        } = this.props;

        const { pickupPerson, invalidPostalCode, showCityAndState, statesList } = this.state;
        const fullNameCaptured = Boolean(pickupPerson?.firstName && pickupPerson.lastName);
        const compKey = `shipToAccessPoint_${editMode ? 'focus' : 'unfocus'}`;

        const {
            halCompany,
            address1,
            city,
            state,
            postalCode,
            email,
            firstName = '',
            lastName = '',
            pickUpPersonAddress1 = '',
            pickUpPersonAddress2 = '',
            pickUpPersonCity = '',
            pickUpPersonState = '',
            pickUpPersonPostalCode = ''
        } = shippingAddress || Empty.Object;

        const { halOperatingHours } = order;

        const locationHoursText = getLocationHoursText(halOperatingHours);

        if (!editMode && !isComplete) {
            return <UpdateError />;
        }

        return (
            <div key={compKey}>
                <Text
                    display='block'
                    mt={4}
                >
                    {halCompany}
                    <br />
                    {address1}, {city}, {state} {postalCode}
                    {locationHoursText && <br />}
                    {locationHoursText}
                </Text>

                {editMode && (
                    <AccessPointButton
                        variant='linkOnly'
                        callback={setAccessPoint}
                    />
                )}
                <Text
                    display='block'
                    fontWeight='bold'
                    mt={4}
                >
                    {getText('pickupPerson')}
                    {!isCanada && !editMode && fullNameCaptured && <span>{` - ${pickupPerson?.firstName} ${pickupPerson?.lastName}`}</span>}
                </Text>
                {isCanada && !editMode && isComplete && (
                    <Box paddingY={4}>
                        <p>{`${firstName} ${lastName}`}</p>
                        <p>{`${pickUpPersonAddress1} ${pickUpPersonAddress2}`}</p>
                        <p>{`${pickUpPersonCity}, ${pickUpPersonState} ${pickUpPersonPostalCode}`}</p>
                    </Box>
                )}
                {!editMode && fullNameCaptured && isGuestCheckout && <Text display='block'>{email}</Text>}
                <Text display='block'>{getText(isCanada ? 'idRequiredCA' : 'idRequired')}</Text>
                {editMode && (
                    <>
                        <Grid
                            columns={[1, 2]}
                            gap={4}
                            paddingTop={4}
                            marginBottom={4}
                        >
                            <TextInput
                                name='firstName'
                                marginBottom={null}
                                required={true}
                                label={getText('firstName')}
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
                                label={getText('lastName')}
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
                                    label={getText('email')}
                                    infoText={getText('emailRequiredText')}
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
                                label={getText('phoneNumber')}
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
                                        label={getText('streetAddress')}
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
                                        label={getText('addressLine2')}
                                        value={pickupPerson?.addressLine2}
                                        onChange={this.updatePickupPerson}
                                        maxLength={FormValidator.FIELD_LENGTHS.address}
                                        ref={comp => (this.addressLine2Input = comp)}
                                        validateError={this.handleValidateStreetAddressLine2}
                                        customStyle={styles.addressInput}
                                    />
                                    <Grid columns={2}>
                                        <TextInput
                                            name={POSTAL_CODE}
                                            required={true}
                                            marginBottom={null}
                                            label={getText('postalCode')}
                                            value={pickupPerson?.postalCode}
                                            onChange={this.handlePostalCode}
                                            maxLength={FormValidator.FIELD_LENGTHS.postalCode}
                                            ref={comp => (this.postalCodeInput = comp)}
                                            invalid={invalidPostalCode}
                                            message={invalidPostalCode && getText('invalidPostalCode')}
                                            validateError={this.handleValidatePostalCode}
                                        />
                                        {!showCityAndState && (
                                            <Text
                                                marginTop={1}
                                                fontSize='sm'
                                            >
                                                {getText('enterPostalCode')}
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
                                                label={getText('city')}
                                                value={pickupPerson?.city}
                                                onChange={this.updatePickupPerson}
                                                maxLength={FormValidator.FIELD_LENGTHS.city}
                                                ref={comp => (this.cityInput = comp)}
                                                validateError={this.handleValidateCity}
                                            />
                                            <Select
                                                label={getText('province')}
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
                            {getText('shipToAddress')}
                        </Link>
                        <AccordionButton onClick={this.debouncedSaveAndContinue} />
                    </>
                )}
            </div>
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
    }
};

ShipToAccessPoint.defaultProps = {
    shippingAddress: {},
    isCanada: false
};

export default wrapComponent(ShipToAccessPoint, 'ShipToAccessPoint', true);
