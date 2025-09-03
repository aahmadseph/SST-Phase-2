/* eslint-disable complexity */
/* eslint-disable class-methods-use-this */

// eslint-disable-next-line no-unused-vars
import React from 'react';
import ReactDOM from 'react-dom';
import AddressActions from 'actions/AddressActions';
import LanguageLocale from 'utils/LanguageLocale';
import utilityApi from 'services/api/utility';
import store from 'store/Store';
import EditDataActions from 'actions/EditDataActions';
import ErrorsUtils from 'utils/Errors';
import ErrorConstants from 'utils/ErrorConstants';
import HelperUtils from 'utils/Helpers';
import FormValidator from 'utils/FormValidator';
import LoqateApi from 'services/api/thirdparty/Loqate';
import Debounce from 'utils/Debounce';
import BaseClass from 'components/BaseClass';
const DEBOUNCE_ADDRESS = 200;
let debounceSubscription;
import keyConsts from 'utils/KeyConstants';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import addressUtils from 'utils/Address';
import helperUtils from 'utils/Helpers';
import UI from 'utils/UI';
import ErrorList from 'components/ErrorList';
import { colors, forms, space } from 'style/config';
import localeUtils from 'utils/LanguageLocale';
import UIUtils from 'utils/UI';
import { mediaQueries } from 'style/config';

import TextInput from 'components/Inputs/TextInput/TextInput';
import Select from 'components/Inputs/Select/Select';
import Chevron from 'components/Chevron';

import { wrapComponent } from 'utils/framework';
import { Box, Link, Grid } from 'components/ui';

const GRID_GUTTER = 4;
const AVS_ELEMENTS_ON_VIEW = 6;
const postalCodeLength = FormValidator.FIELD_LENGTHS.postalCode;
const zipCodeLength = FormValidator.FIELD_LENGTHS.zipCode;

const { isCountryInternational, getCurrentLanguage, LANGUAGES, COUNTRIES } = LanguageLocale;
const { sanitizeUSAddress, sanitizeUSAddressTwo, sanitizeInput } = helperUtils;
const { isSMUI } = UIUtils;

class RwdAddressForm extends BaseClass {
    constructor(props) {
        super();

        this.state = {
            address: Object.assign({}, props.address),
            selectedState: '',
            stateList: [],
            zipCodeInvalid: false,
            cityStateZipInvalid: false,
            countryInvalid: false,
            isInternational: isCountryInternational(props.country),
            errorMessages: '',
            displayCityStateInputs: props.address && props.address.postalCode,
            showAddress2Input: props.showAddress2Input ? props.showAddress2Input : props.address && props.address.address2,
            loqateAddresses: [],
            hasAddress1Focus: false,
            highlightedAddrIndex: -1,
            isAddressVerified: props.address && props.address.isAddressVerified,
            highlightTexts: [],
            isAddressModified: false,
            isAdsRestricted: props.isAdsRestricted
        };

        this.state.address.country = props.country;
        this.state.address.formattedPhone = this.getFormattedPhoneNumber(this.state.address.phone || '');
    }

    componentDidMount() {
        this.props.onRef(this);
        this.loqateWaitingFor = '';
        const country = this.state.address.country;

        //if address is international (excluding canada) and we're in editMode
        //set selectedState state to edit address state
        if (this.state.isInternational && this.props.isEditMode) {
            this.updateEditStore('state', this.props.address.state);
        } else if (!this.state.isInternational) {
            AddressActions.getStateList(country, states => this.setStateList(states, country));
        }

        store.setAndWatch('editData.' + this.props.editStore, this, editData => {
            const editStore = editData[this.props.editStore] || {};
            this.setState(prevState => {
                return { address: Object.assign({}, prevState.address, editStore) };
            });
        });

        this.props.isCheckout && this.firstNameInput && this.firstNameInput.focus();
    }

    hasAVS = () => {
        const { isBillingAddress, hasAVS = true } = this.props;
        const { isInternational } = this.state;

        return Sephora.configurationSettings.enableAddressValidation && !isInternational && !isBillingAddress && hasAVS;
    };

    renderFirstName = () => {
        const {
            isFirstNameFieldDisabled,
            localization: { firstNameText }
        } = this.props;
        const { address, isAdsRestricted } = this.state;
        const isUS = localeUtils.isUS();
        const maxLengthVal = isAdsRestricted ? FormValidator.FIELD_LENGTHS.firstNameAdsRestricted : FormValidator.FIELD_LENGTHS.name;

        return (
            <TextInput
                name='firstName'
                label={firstNameText}
                autoComplete='given-name'
                autoCorrect='off'
                required={true}
                hideAsterisk={isUS}
                maxLength={maxLengthVal}
                disabled={isFirstNameFieldDisabled}
                value={address.firstName}
                ref={comp => (this.firstNameInput = comp)}
                onChange={this.handleInputSanitization}
                onKeyUp={this.handleInputSanitization}
                onBlur={this.handleFnameBlur}
                validateError={firstName => {
                    if (FormValidator.isEmpty(firstName)) {
                        this.props.isSubscription &&
                            this.props.fireFormErrorAnalytics(this.props.modalTitle, ErrorsUtils.getMessage(ErrorConstants.ERROR_CODES.FIRST_NAME));

                        return ErrorConstants.ERROR_CODES.FIRST_NAME;
                    }

                    if (!FormValidator.isValidLength(firstName, 1, maxLengthVal)) {
                        this.props.isSubscription &&
                            this.props.fireFormErrorAnalytics(
                                this.props.modalTitle,
                                isAdsRestricted
                                    ? ErrorsUtils.getMessage(ErrorConstants.ERROR_CODES.FIRST_NAME_ADS_LONG)
                                    : ErrorsUtils.getMessage(ErrorConstants.ERROR_CODES.FIRST_NAME_LONG)
                            );

                        return isAdsRestricted ? ErrorConstants.ERROR_CODES.FIRST_NAME_ADS_LONG : ErrorConstants.ERROR_CODES.FIRST_NAME_LONG;
                    }

                    return null;
                }}
                data-at={Sephora.debug.dataAt('first_name_input')}
                dataAtError={Sephora.debug.dataAt('first_name_required_error')}
            />
        );
    };

    renderLastName = () => {
        const {
            isLastNameFieldDisabled,
            localization: { lastNameText }
        } = this.props;
        const { address, isAdsRestricted } = this.state;
        const isUS = localeUtils.isUS();
        const maxLengthVal = isAdsRestricted ? FormValidator.FIELD_LENGTHS.lastNameAdsRestricted : FormValidator.FIELD_LENGTHS.name;

        return (
            <TextInput
                name='lastName'
                label={lastNameText}
                autoComplete='family-name'
                autoCorrect='off'
                required={true}
                hideAsterisk={isUS}
                maxLength={maxLengthVal}
                disabled={isLastNameFieldDisabled}
                value={address.lastName}
                onChange={this.handleInputSanitization}
                onKeyUp={this.handleInputSanitization}
                onBlur={this.handleLnameBlur}
                ref={comp => (this.lastNameInput = comp)}
                validateError={lastName => {
                    if (FormValidator.isEmpty(lastName)) {
                        this.props.isSubscription &&
                            this.props.fireFormErrorAnalytics(this.props.modalTitle, ErrorsUtils.getMessage(ErrorConstants.ERROR_CODES.LAST_NAME));

                        return ErrorConstants.ERROR_CODES.LAST_NAME;
                    }

                    if (!FormValidator.isValidLength(lastName, 1, maxLengthVal)) {
                        this.props.isSubscription &&
                            this.props.fireFormErrorAnalytics(
                                this.props.modalTitle,
                                isAdsRestricted
                                    ? ErrorsUtils.getMessage(ErrorConstants.ERROR_CODES.LAST_NAME_ADS_LONG)
                                    : ErrorsUtils.getMessage(ErrorConstants.ERROR_CODES.LAST_NAME_LONG)
                            );

                        return isAdsRestricted ? ErrorConstants.ERROR_CODES.LAST_NAME_ADS_LONG : ErrorConstants.ERROR_CODES.LAST_NAME_LONG;
                    }

                    return null;
                }}
                data-at={Sephora.debug.dataAt('last_name_input')}
                dataAtError={Sephora.debug.dataAt('last_name_required_error')}
            />
        );
    };

    renderCountry = () => {
        const {
            isBillingAddress,
            disableCountryList,
            localization: { caName, usName, countryText }
        } = this.props;
        const { address } = this.state;
        const isUS = localeUtils.isUS();
        const isCanada = address.country === COUNTRIES.CA;

        //TODO: Update this when an improvement story comes on later sprint
        let countryList = this.props.countryList;

        if (isSMUI() && !isBillingAddress && (isUS || isCanada)) {
            const mobileCountryList = [
                {
                    countryCode: 'CA',
                    countryLongName: caName
                },
                {
                    countryCode: 'US',
                    countryLongName: usName
                }
            ];
            countryList = mobileCountryList;
        }

        return (
            <Select
                name='country'
                label={countryText}
                autoComplete='country'
                value={this.state.address.country}
                invalid={this.state.countryInvalid}
                onChange={this.handleCountrySelect}
                disabled={disableCountryList}
                ref={comp => (this.countrySelect = comp)}
            >
                {countryList &&
                    countryList.length &&
                    countryList.map(country => (
                        <option
                            key={country.countryCode}
                            value={country.countryCode}
                        >
                            {country.countryLongName}
                        </option>
                    ))}
            </Select>
        );
    };

    renderAVS = () => {
        const { loqateAddresses, hasAddress1Focus, highlightedAddrIndex } = this.state;

        const hasResults = !!(loqateAddresses && loqateAddresses.length > 0);

        return (
            <Box
                is='ul'
                overflowY='auto'
                lineHeight='tight'
                maxHeight={370}
                position='absolute'
                top='100%'
                marginTop={`-${forms.BORDER_WIDTH}px`}
                left={0}
                right={0}
                padding={2}
                borderRadius={2}
                backgroundColor='white'
                ref={comp => (this.addressPrediction = comp)}
                boxShadow='light'
                zIndex={1}
                role='listbox'
                id='avs_listbox'
                onMouseLeave={() => this.setHighlightedAddrIndex(-1)}
                style={
                    !(hasAddress1Focus && hasResults)
                        ? {
                            display: 'none'
                        }
                        : null
                }
            >
                {hasResults &&
                    loqateAddresses.map((loqateAddress, index) => {
                        const isActive = index === highlightedAddrIndex;
                        loqateAddress.Highlight = this.getHighlight(loqateAddress);

                        return (
                            <li
                                key={loqateAddress.Id || index.toString()}
                                role='option'
                                aria-selected={isActive}
                                id={`avs_result${index}`}
                                css={[styles.avsItem, isActive && styles.avsItemActive]}
                                onMouseEnter={() => this.setHighlightedAddrIndex(index)}
                                onClick={() => this.handleLoqateAddressClick(loqateAddress)}
                            >
                                <div css={styles.avsItemInner}>
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: this.highlightAVSSearchTerm(loqateAddress.Text, loqateAddress.Highlight)
                                        }}
                                    />
                                    <div
                                        css={styles.avsItemDesc}
                                        dangerouslySetInnerHTML={{
                                            __html: this.highlightAVSUnits(loqateAddress.Description)
                                        }}
                                    />
                                </div>
                                {loqateAddress.Type !== 'Address' && (
                                    <Chevron
                                        marginLeft={2}
                                        direction='right'
                                    />
                                )}
                            </li>
                        );
                    })}
            </Box>
        );
    };

    renderAddress1 = () => {
        const { highlightedAddrIndex, address, isAdsRestricted, isAddressVerified } = this.state;
        const {
            localization: { streetAddress }
        } = this.props;
        const isUS = localeUtils.isUS();
        const hasAVS = this.hasAVS();

        const isRestrictedLength = isAdsRestricted || !isAddressVerified;

        const maxLengthVal = isRestrictedLength ? FormValidator.FIELD_LENGTHS.addressAdsRestricted : FormValidator.FIELD_LENGTHS.address;

        let avsProps;

        if (hasAVS) {
            avsProps = {
                ['aria-autocomplete']: 'list',
                ['aria-controls']: 'avs_listbox',
                ['aria-activedescendant']: highlightedAddrIndex > -1 ? `avs_result${highlightedAddrIndex}` : null,
                id: 'avs_input',
                onBlur: this.handleAddress1Blur,
                onFocus: this.handleAddress1Focus,
                onKeyDown: this.handleAddress1KeyDown,
                onChange: this.handleAddress1ChangeDebounced
            };
        }

        return (
            <Box position='relative'>
                <TextInput
                    {...avsProps}
                    name='address1'
                    onKeyUp={this.handleAddress1KeyUp}
                    label={streetAddress}
                    autoComplete={hasAVS ? (UI.isChrome() ? 'nope' : 'off') : 'address-line1'}
                    autoCorrect='off'
                    required={true}
                    hideAsterisk={isUS}
                    maxLength={maxLengthVal}
                    value={address.address1}
                    ref={comp => (this.addressInput = comp)}
                    validateError={addressVal => {
                        if (FormValidator.isEmpty(addressVal)) {
                            this.props.isSubscription &&
                                this.props.fireFormErrorAnalytics(this.props.modalTitle, ErrorsUtils.getMessage(ErrorConstants.ERROR_CODES.ADDRESS1));

                            return ErrorConstants.ERROR_CODES.ADDRESS1;
                        }

                        if (!FormValidator.isValidLength(addressVal, 1, maxLengthVal)) {
                            this.props.isSubscription &&
                                this.props.fireFormErrorAnalytics(
                                    this.props.modalTitle,
                                    isRestrictedLength
                                        ? ErrorsUtils.getMessage(ErrorConstants.ERROR_CODES.ADDRESS1_ADS_LONG)
                                        : ErrorsUtils.getMessage(ErrorConstants.ERROR_CODES.ADDRESS1_LONG)
                                );

                            return isRestrictedLength ? ErrorConstants.ERROR_CODES.ADDRESS1_ADS_LONG : ErrorConstants.ERROR_CODES.ADDRESS1_LONG;
                        }

                        return null;
                    }}
                    data-at={Sephora.debug.dataAt('street_address_input')}
                    dataAtError={Sephora.debug.dataAt('address_required_error')}
                />
                {hasAVS && this.renderAVS()}
            </Box>
        );
    };

    renderAddress2 = hasGridLayout => {
        const { isAdsRestricted } = this.state;
        const {
            localization: { address2LabelText, optional, add }
        } = this.props;
        const isUS = localeUtils.isUS();

        const maxLengthVal = FormValidator.FIELD_LENGTHS.addressAdsRestricted;
        const frenchLabelAsOptional = isUS && LanguageLocale.isFrench() && address2LabelText.substring(0, 39);

        const address2Label = !isUS ? address2LabelText : `${frenchLabelAsOptional || address2LabelText} ${optional}`;

        return (
            <React.Fragment>
                <div style={this.state.showAddress2Input ? { display: 'none' } : null}>
                    <Link
                        aria-expanded={this.state.showAddress2Input}
                        aria-controls='address2_section'
                        onClick={this.handleAddress2SectionClick}
                        display='block'
                        lineHeight='tight'
                        color='blue'
                        marginBottom={forms.MARGIN_BOTTOM}
                        children={`${add} ${address2LabelText}`}
                    />
                </div>
                <Grid
                    id='address2_section'
                    style={!this.state.showAddress2Input ? { display: 'none' } : null}
                    gridTemplateColumns={hasGridLayout ? ['100%', '1fr 1fr'] : null}
                >
                    <TextInput
                        name='address2'
                        autoComplete='address-line2'
                        autoCorrect='off'
                        onChange={this.handleAddress2Change}
                        onKeyUp={this.handleAddress2Change}
                        label={address2Label}
                        ref={comp => (this.address2Input = comp)}
                        maxLength={maxLengthVal}
                        value={this.state.address.address2}
                        validateError={address => {
                            if (!FormValidator.isValidLength(address, 0, maxLengthVal)) {
                                this.props.isSubscription &&
                                    this.props.fireFormErrorAnalytics(
                                        this.props.modalTitle,
                                        isAdsRestricted
                                            ? ErrorsUtils.getMessage(ErrorConstants.ERROR_CODES.ADDRESS1_ADS_LONG)
                                            : ErrorsUtils.getMessage(ErrorConstants.ERROR_CODES.ADDRESS1_LONG)
                                    );

                                return isAdsRestricted ? ErrorConstants.ERROR_CODES.ADDRESS1_ADS_LONG : ErrorConstants.ERROR_CODES.ADDRESS1_LONG;
                            }

                            return null;
                        }}
                        data-at={Sephora.debug.dataAt('address_line_2')}
                    />
                </Grid>
            </React.Fragment>
        );
    };

    renderPostalCode = () => {
        const {
            isInternational, address, isAdsRestricted, zipCodeInvalid, cityStateZipInvalid
        } = this.state;
        const {
            localization: { postalCode, zipPostalCode }
        } = this.props;
        const isUS = address.country ? address.country === COUNTRIES.US : localeUtils.isUS();
        const isCanada = address.country === COUNTRIES.CA;
        const maxLengthVal = isAdsRestricted
            ? FormValidator.FIELD_LENGTHS.zipCodeAdsRestricted
            : isInternational
                ? null
                : isCanada
                    ? postalCodeLength
                    : zipCodeLength;

        return (
            <TextInput
                name='postalCode'
                autoComplete='postal-code'
                autoCorrect='off'
                isUS={isUS}
                type={isInternational || isCanada ? 'text' : 'tel'}
                label={isInternational || isCanada ? postalCode : zipPostalCode}
                required={true}
                maxLength={maxLengthVal}
                hideAsterisk={isUS}
                value={address.postalCode}
                invalid={zipCodeInvalid || cityStateZipInvalid}
                onChange={this.handleZipCodeOnChange}
                onKeyDown={isUS && FormValidator.inputAcceptOnlyNumbers}
                ref={comp => (this.zipCodeInput = comp)}
                validateError={zipCode => {
                    if (FormValidator.isEmpty(zipCode)) {
                        this.props.isSubscription &&
                            this.props.fireFormErrorAnalytics(
                                this.props.modalTitle,
                                isUS
                                    ? ErrorsUtils.getMessage(ErrorConstants.ERROR_CODES.ZIP_CODE_US)
                                    : ErrorsUtils.getMessage(ErrorConstants.ERROR_CODES.ZIP_CODE_NON_US)
                            );

                        return isUS ? ErrorConstants.ERROR_CODES.ZIP_CODE_US : ErrorConstants.ERROR_CODES.ZIP_CODE_NON_US;
                    }

                    if ((!isInternational && !FormValidator.isValidZipCode(zipCode, isUS ? 'US' : 'CA')) || this.state.zipCodeInvalid) {
                        this.props.isSubscription &&
                            this.props.fireFormErrorAnalytics(
                                this.props.modalTitle,
                                ErrorsUtils.getMessage(ErrorConstants.ERROR_CODES.INVALID_ZIP_CODE)
                            );

                        return ErrorConstants.ERROR_CODES.INVALID_ZIP_CODE;
                    }

                    if (isAdsRestricted && !FormValidator.isValidLength(zipCode, 1, maxLengthVal)) {
                        this.props.isSubscription &&
                            this.props.fireFormErrorAnalytics(
                                this.props.modalTitle,
                                ErrorsUtils.getMessage(ErrorConstants.ERROR_CODES.ZIPCODE_ADS_LONG)
                            );

                        return ErrorConstants.ERROR_CODES.ZIPCODE_ADS_LONG;
                    }

                    return null;
                }}
                message={
                    this.state.zipCodeInvalid || this.state.cityStateZipInvalid ? this.state.zipCodeInvalid || this.state.cityStateZipInvalid : null
                }
                data-at={Sephora.debug.dataAt('zip_postal_code_input')}
                dataAtError={Sephora.debug.dataAt('zip_code_required_error')}
            />
        );
    };

    renderCity = () => {
        const { isAdsRestricted } = false; // disabled as validated on CE
        const { address, cityStateZipInvalid } = this.state;
        const {
            localization: { cityText }
        } = this.props;
        const isUS = localeUtils.isUS();

        const maxLength = isAdsRestricted ? FormValidator.FIELD_LENGTHS.cityAdsRestricted : FormValidator.FIELD_LENGTHS.city;

        return (
            <TextInput
                name='city'
                autoComplete='address-level2'
                autoCorrect='off'
                onChange={this.handleCityOnChange}
                label={cityText}
                required={true}
                hideAsterisk={isUS}
                maxLength={maxLength}
                invalid={cityStateZipInvalid}
                value={address.city}
                ref={comp => (this.cityInput = comp)}
                validateError={city => {
                    if (FormValidator.isEmpty(city)) {
                        this.props.isSubscription &&
                            this.props.fireFormErrorAnalytics(this.props.modalTitle, ErrorsUtils.getMessage(ErrorConstants.ERROR_CODES.CITY));

                        return ErrorConstants.ERROR_CODES.CITY;
                    }

                    if (!FormValidator.isValidLength(city, 1, maxLength)) {
                        this.props.isSubscription &&
                            this.props.fireFormErrorAnalytics(
                                this.props.modalTitle,
                                isAdsRestricted
                                    ? ErrorsUtils.getMessage(ErrorConstants.ERROR_CODES.CITY_ADS_LONG)
                                    : ErrorsUtils.getMessage(ErrorConstants.ERROR_CODES.CITY_LONG)
                            );

                        return isAdsRestricted ? ErrorConstants.ERROR_CODES.CITY_ADS_LONG : ErrorConstants.ERROR_CODES.CITY_LONG;
                    }

                    return null;
                }}
                data-at={Sephora.debug.dataAt('city_input')}
            />
        );
    };

    renderStateProvince = () => {
        const { isInternational, address, displayCityStateInputs, cityStateZipInvalid } = this.state;
        const {
            localization: { region, province, stateRegion }
        } = this.props;

        const isCanada = address.country === COUNTRIES.CA;
        const isUS = localeUtils.isUS();

        const stateOrProvinceError = () => {
            return !isCountryInternational(this.state.address.country) && !this.state.address.state;
        };

        return isInternational ? (
            <TextInput
                name='state'
                label={region}
                autoComplete='address-level1'
                autoCorrect='off'
                maxLength={FormValidator.FIELD_LENGTHS.stateRegion}
                value={this.state.address.state}
                onChange={e => this.updateEditStore(e.target.name, e.target.value)}
                ref={comp => (this.regionInput = comp)}
            />
        ) : displayCityStateInputs ? (
            <Select
                label={isCanada ? province : stateRegion}
                autoComplete='address-level1'
                name='state'
                value={address.state}
                required={true}
                hideAsterisk={isUS}
                invalid={cityStateZipInvalid || stateOrProvinceError()}
                onChange={this.handleStateSelect}
                ref={comp => (this.stateSelect = comp)}
                isCanada={isCanada}
                validateError={() => {
                    if (stateOrProvinceError()) {
                        this.props.isSubscription &&
                            this.props.fireFormErrorAnalytics(this.props.modalTitle, ErrorsUtils.getMessage(ErrorConstants.ERROR_CODES.STATE));

                        return ErrorConstants.ERROR_CODES.STATE;
                    }

                    return null;
                }}
                data-at={Sephora.debug.dataAt('state_region_select')}
            >
                {this.state.stateList &&
                    this.state.stateList.length &&
                    this.state.stateList.map((state, index) =>
                        // remove `select a state/region`
                        // `hidden` prop not respected by iOS safari
                        index > 0 ? (
                            <option
                                key={state.name}
                                value={state.name}
                                children={state.description}
                            />
                        ) : null
                    )}
            </Select>
        ) : (
            <TextInput
                name='state'
                maxLength={FormValidator.FIELD_LENGTHS.stateRegion}
                customStyle={{
                    root: { display: 'none' }
                }}
            />
        );
    };

    renderPhone = () => {
        const { isInternational, address, phoneInvalid } = this.state;
        const {
            localization: { phone, phoneContext }
        } = this.props;
        const isUS = localeUtils.isUS();
        const phoneLabel = isUS ? `${phone} ${phoneContext}` : phone;

        return (
            <TextInput
                name='phone'
                label={phoneLabel}
                autoComplete='tel'
                autoCorrect='off'
                type='tel'
                maxLength={isInternational ? FormValidator.FIELD_LENGTHS.internationalPhone : FormValidator.FIELD_LENGTHS.formattedPhone}
                required={true}
                hideAsterisk={isUS}
                invalid={phoneInvalid}
                value={address.formattedPhone || address.phone}
                ref={comp => (this.phoneNumberInput = comp)}
                onKeyDown={FormValidator.inputAcceptOnlyNumbers}
                onChange={this.formatPhoneNumber}
                validateError={phoneNumber => {
                    if (FormValidator.isEmpty(phoneNumber)) {
                        this.props.isSubscription &&
                            this.props.fireFormErrorAnalytics(this.props.modalTitle, ErrorsUtils.getMessage(ErrorConstants.ERROR_CODES.PHONE_NUMBER));

                        return ErrorConstants.ERROR_CODES.PHONE_NUMBER;
                    }

                    if (!isInternational && phoneNumber.length !== FormValidator.FIELD_LENGTHS.formattedPhone) {
                        this.props.isSubscription &&
                            this.props.fireFormErrorAnalytics(
                                this.props.modalTitle,
                                ErrorsUtils.getMessage(ErrorConstants.ERROR_CODES.PHONE_NUMBER_INVALID)
                            );

                        return ErrorConstants.ERROR_CODES.PHONE_NUMBER_INVALID;
                    }

                    return null;
                }}
                data-at={Sephora.debug.dataAt('phone_number_input')}
                dataAtError={Sephora.debug.dataAt('phone_number_required_error')}
            />
        );
    };

    updateEditStore = (name, value) => {
        const editStore = store.getState().editData[this.props.editStore];
        store.dispatch(EditDataActions.updateEditData(Object.assign({}, editStore, { [name]: value }), this.props.editStore));

        this.hasAVS() && this.verifyLoqateAddressState(name, value);
    };

    componentWillUnmount() {
        store.dispatch(EditDataActions.clearEditData(this.props.editStore));
        clearTimeout(debounceSubscription);
    }

    formatZipPostalCode = (inputData, divider, leftLength, totalLength) => {
        const formatZipPostal = addressUtils.formatZipPostalCode(inputData, divider, leftLength, totalLength);
        this.updateEditStore('postalCode', formatZipPostal);

        return formatZipPostal;
    };

    autoFillCityAndState = zipCode => {
        utilityApi
            .getStateAndCityForZipCode(this.state.address.country, zipCode)
            .then(data => {
                this.setState({
                    displayCityStateInputs: true,
                    zipCodeInvalid: null
                });
                this.updateEditStore('state', data.state);
                this.updateEditStore('city', HelperUtils.titleCase(data.city));
            })
            .catch(() => {
                this.updateEditStore('state', '');
                this.updateEditStore('city', '');
                this.setState({
                    displayCityStateInputs: false,
                    zipCodeInvalid: 'Please enter a valid zipcode.'
                });
            });
    };

    /* eslint-disable-next-line complexity */
    handleZipCodeOnChange = e => {
        const value = e.target.value;
        const currentPostalCode = this.state.address.postalCode;

        //check to avoid duplicate calls when auto fill is used
        if (value === currentPostalCode) {
            return;
        }

        if (this.state.address.country === COUNTRIES.US) {
            const zipCode = this.formatZipPostalCode(value, '-', 5, 9);

            //if zipcode has valid length make autoFillCityAndState call
            //if user removes part of valid zipcode, reset state and city inputs
            if (
                zipCode &&
                !this.state.zipCodeInvalid &&
                (zipCode.length === 5 || zipCode.length === 10) &&
                !this.state.address.state &&
                !this.state.address.city
            ) {
                this.autoFillCityAndState(zipCode);
            } else if (!zipCode || (zipCode && zipCode.length < 5)) {
                if (this.state.address.state || this.state.address.city) {
                    this.updateEditStore('state', '');
                    this.updateEditStore('city', '');
                }

                this.setState({
                    zipCodeInvalid: null,
                    cityStateZipInvalid: null,
                    displayCityStateInputs: false
                });
            } else if (zipCode && zipCode.length === 5 && zipCode !== currentPostalCode.slice(0, 5)) {
                //if user removes part of zipcode until there is 5 new digits
                //make api call again to check if new zip is valid or not
                this.autoFillCityAndState(zipCode);
            }
        } else if (this.state.address.country === COUNTRIES.CA) {
            const postalCode = this.formatZipPostalCode(value.toUpperCase(), ' ', 3, 6);

            //if postalCode has valid length make autoFillCityAndState call
            //if user removes part of valid postalCode, reset state and city inputs
            if (postalCode && postalCode.length === 7) {
                this.autoFillCityAndState(postalCode);
            } else if (!postalCode || (postalCode && postalCode.length < 7)) {
                if (this.state.address.state || this.state.address.city) {
                    this.updateEditStore('state', '');
                    this.updateEditStore('city', '');
                }

                this.setState({
                    zipCodeInvalid: null,
                    cityStateZipInvalid: null,
                    displayCityStateInputs: false
                });
            }
        } else {
            this.updateEditStore('postalCode', value.toUpperCase());
        }
    };

    setStateList = (states, country) => {
        const { isEditMode } = this.props;

        const { address = {} } = this.state;

        if (isEditMode) {
            this.setState({ stateList: states });
            this.updateEditStore('country', country);

            //TODO: remove countrySelect.setValue once select is fixed
            if (this.countrySelect) {
                this.countrySelect.setValue(country);
            }

            //TODO: remove stateSelect.setValue once select is fixed
            if (this.stateSelect && address.state) {
                this.stateSelect.setValue(address.state);
                this.updateEditStore('state', address.state);
            }
        } else {
            this.setState({ stateList: states });
            this.updateEditStore('country', country);

            //TODO: remove countrySelect.setValue once select is fixed
            if (this.countrySelect) {
                this.countrySelect.setValue(country);
            }
        }
    };

    handleCityOnChange = e => {
        this.updateEditStore(e.target.name, e.target.value);
        this.setState({ cityStateZipInvalid: null });
    };

    handleStateSelect = e => {
        this.updateEditStore('state', e.target.value);
        this.setState({ cityStateZipInvalid: null });
    };

    resetCountryAndStateInfo = (country, stateList, isInternational) => {
        this.setState({
            stateList: stateList,
            isInternational: isInternational,
            displayCityStateInputs: false,
            zipCodeInvalid: null,
            address: {
                ...this.state.address,
                phone: '',
                formattedPhone: ''
            }
        });
        this.updateEditStore('country', country);
        this.updateEditStore('state', '');
        this.updateEditStore('city', '');
        this.updateEditStore('postalCode', '');

        if (this.props.onCountryChange) {
            this.props.onCountryChange(country);
        }
    };

    handleCountrySelect = e => {
        const country = e.target.value;
        const isInternational = isCountryInternational(country);

        if (!isInternational) {
            AddressActions.getStateList(country, states => this.resetCountryAndStateInfo(country, states, isInternational));
        } else {
            this.resetCountryAndStateInfo(country, null, isInternational);
        }
    };

    getFormattedPhoneNumber = rawValue => {
        if (this.state.isInternational) {
            return rawValue;
        }

        return FormValidator.getFormattedPhoneNumber(rawValue);
    };

    formatPhoneNumber = e => {
        const rawValue = e.target.value.replace(HelperUtils.specialCharacterRegex, '');
        const currentCursorPosition = e.target.selectionStart;

        this.setState(
            {
                address: {
                    ...this.state.address,
                    phone: rawValue,
                    formattedPhone: this.getFormattedPhoneNumber(rawValue)
                }
            },
            () => {
                if (!this.phoneNumberInput.inputElementRef) {
                    return;
                }

                let additionalSpacesAddedByFormatter = 0;

                if (rawValue.length === 4) {
                    additionalSpacesAddedByFormatter = 3;
                } else if (rawValue.length === 7) {
                    additionalSpacesAddedByFormatter = 1;
                }

                this.phoneNumberInput.inputElementRef.selectionEnd = currentCursorPosition + additionalSpacesAddedByFormatter;
            }
        );
    };

    validateForm = (doNotClearErrors, shouldDispatchErrors = true) => {
        const fieldsForValidation = [];

        // if user is on checkout and is editing a billing address
        // there is no firstName or lastName inputs, so no need to validate
        if (this.props.isBillingAddress && this.props.isCheckout) {
            fieldsForValidation.push(this.addressInput, this.zipCodeInput, this.cityInput);
        } else {
            fieldsForValidation.push(this.firstNameInput, this.lastNameInput, this.addressInput, this.zipCodeInput, this.cityInput);

            if (this.props.isGuestCheckout) {
                fieldsForValidation.push(this.emailInput);
            }
        }

        // Check if the current selected country is other than US or CA
        if (this.state.isInternational) {
            // This call has to be made after finishing rendering, or else this.regionInput would be
            // undefined
            fieldsForValidation.push(this.regionInput);
        }

        if (!this.props.isPhoneFieldHidden) {
            fieldsForValidation.push(this.phoneNumberInput);
        }

        if (!doNotClearErrors) {
            ErrorsUtils.clearErrors();
        }

        ErrorsUtils.collectClientFieldErrors(fieldsForValidation);

        // Will return true if valid, false if not
        return !ErrorsUtils.validate(fieldsForValidation, shouldDispatchErrors);
    };

    handleResponseError = (message, value, errorKey) => {
        const cityInvalid = errorKey === ErrorConstants.ERROR_CODES.LOOKUP_CITY_INVALID && message;
        const stateInvalid = errorKey === ErrorConstants.ERROR_CODES.LOOKUP_STATE_INVALID && message;
        const zipCodeInvalid = errorKey === ErrorConstants.ERROR_CODES.LOOKUP_POSTAL_CODE_INVALID && message;
        const locationError = cityInvalid || stateInvalid || zipCodeInvalid;

        if (locationError) {
            this.setState({ cityStateZipInvalid: locationError });

            return true; // returns true if any of these errors are handled by this form
        }

        switch (errorKey) {
            case ErrorConstants.ERROR_CODES.ADDRESS1_INCORRECT:
                this.addressInput.showError(message, value, errorKey);

                return true;
            case ErrorConstants.ERROR_CODES.ADDRESS2_INCORRECT:
                this.address2Input.showError(message, value, errorKey);

                return true;
            case ErrorConstants.ERROR_CODES.FIRST_NAME_INCORRECT:
                this.firstNameInput.showError(message, value, errorKey);

                return true;
            case ErrorConstants.ERROR_CODES.LAST_NAME_INCORRECT:
                this.lastNameInput.showError(message, value, errorKey);

                return true;
            default:
        }

        return false;
    };

    getData = () => {
        const { address, isAddressVerified } = this.state;

        //if country is CA or International ensure that postalCode is all upperCase
        if (address.country === COUNTRIES.CA) {
            address.postalCode.toUpperCase();
        }

        // if user is editing billing address on checkout
        // then there will be no firstName or lastName input
        const addressData = {
            address: {
                firstName: address.firstName,
                lastName: address.lastName,
                address1: address.address1,
                address2: address.address2,
                postalCode: address.postalCode,
                city: address.city,
                state: address.state,
                country: address.country
            },
            isPOBoxAddress: isAddressVerified ? address.isPOBoxAddress : undefined,
            addressType: isAddressVerified ? address.addressType : undefined
        };

        if (!this.props.isPhoneFieldHidden) {
            addressData.address.phone = address.phone.replace(HelperUtils.specialCharacterRegex, '');
        }

        if (this.props.isGuestCheckout) {
            addressData.address.shipEmail = address.email;
        }

        if (this.props.isEditMode) {
            addressData.address.addressId = address.addressId;
        }

        return addressData;
    };

    handleAddress2Change = e => {
        const sanitizedValue = sanitizeUSAddressTwo(e.target.value);
        this.address2Input?.setValue(sanitizedValue);
        this.updateEditStore(e.target.name, sanitizedValue);
    };

    handleAddress2SectionClick = () => {
        this.setState({ showAddress2Input: true }, () => {
            this.setFieldFocus(this.address2Input);
        });
    };

    setFieldFocus = node => {
        clearTimeout(debounceSubscription);
        ReactDOM.findDOMNode(node).querySelector('input').focus();
    };

    handleAddress1Focus = () => {
        this.addressInput?.setValue(this.state.address.address1);

        this.setState({ hasAddress1Focus: true });
    };

    handleAddress1Blur = () => {
        debounceSubscription = Debounce.debounce.call(this, this.blurAddress1, DEBOUNCE_ADDRESS)();
    };

    blurAddress1 = () => {
        this.addressInput?.setValue(this.state.address.address1);

        this.setState({
            hasAddress1Focus: false,
            loqateAddresses: []
        });
    };

    // Check if we make the Loqate Address dirty by manually modyfing addresses fields

    verifyLoqateAddressState = (field, value) => {
        let initialFieldValue;

        switch (field) {
            case 'address1':
            case 'address2':
            case 'postalCode':
            case 'city':
            case 'state':
                initialFieldValue = this.props.address && this.props.address[field];

                if (initialFieldValue !== value) {
                    this.setState({
                        isAddressVerified: false,
                        isAddressModified: true
                    });
                }

                break;
            default:
                break;
        }
    };

    handleLoqateAddressClick = loqateAddress => {
        /* If the Type is not 'Address' it means when can call the Loqate service again because
           there are more addresses under this address (multiple units) */
        if (loqateAddress.Type !== 'Address') {
            this.setHighlightTexts(loqateAddress);

            this.getLoqateAddresses(loqateAddress.Text, loqateAddress.Id);
            // return the focus back to the address1 field because we need to show more addresses
            this.setFieldFocus(this.addressInput);
        } else {
            this.verifyLoqateAddress(loqateAddress.Id);
            // Hide AVS to show autocomplete fields
            this.handleAddress1Blur();
        }

        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                linkName: 'D=c55',
                actionInfo: anaConsts.LinkData.RECOMMENDED_ADDRESS,
                eventStrings: [anaConsts.Event.EVENT_71, anaConsts.Event.EVENT_230]
            }
        });
    };

    setHighlightTexts = loqateAddress => {
        const highlights = loqateAddress.Highlight.split(';').shift();
        const highlightTexts = [];

        if (highlights) {
            highlights.split(',').forEach(highlight => {
                const limits = highlight.split('-');
                highlightTexts.push(loqateAddress.Text.substring(limits[0], limits[1]));
            });

            this.setState({ highlightTexts });
        }
    };

    /* Get all addresses from Loqate
       If we pass a container, it should be another Id previously returned from this
       Loqate service when the Type of the result was not 'Address' */

    getLoqateAddresses = (text, container) => {
        const { address } = this.state;
        LoqateApi.findAddresses(text, address.country, container)
            .then(data => {
                /* return early if the address term is old (old promise response) to guarantee
                the correct API response order. Apply it only when there is no container */
                if (!container && text !== this.loqateWaitingFor) {
                    return;
                }

                if (data.Items && data.Items.length === 1 && typeof data.Items[0].Error !== 'undefined') {
                    // Error response from Loqate
                    this.setState({ loqateAddresses: [] });
                } else {
                    // Check if there were any items found
                    if (data.Items && data.Items.length > 0) {
                        this.setState({ loqateAddresses: data.Items }, () => {
                            this.setHighlightedAddrIndex(0, () => this.updateScrollAVS(0));
                        });
                    } else {
                        this.setState({ loqateAddresses: [] });
                    }
                }
            })
            // eslint-disable-next-line no-console
            .catch(err => console.log(err));
    };

    /* Verify the address with Loqate so we can receive the full address details
       and auto-populate the address fields */

    verifyLoqateAddress = id => {
        LoqateApi.retrieveAddress(id)
            .then(data => {
                if (data.Items && data.Items.length === 1 && typeof data.Items[0].Error !== 'undefined') {
                    // @TODO: handle error
                } else {
                    // Check if there were any items found
                    if (data.Items && data.Items.length > 0) {
                        const currentLanguage = getCurrentLanguage().toUpperCase() === LANGUAGES.EN ? LANGUAGES.ENG : LANGUAGES.FRE;
                        // Update Fields with Loqate data
                        const addressObj = data.Items.filter(address => address.Language === currentLanguage)[0] || data.Items[0];
                        let addressLine1 = '';
                        const addressLine2 = addressObj.SubBuilding || '';
                        const city = addressObj.City || '';
                        const postalCode = addressObj.PostalCode || '';
                        const state = addressObj.Province || '';
                        const isPOBoxAddress = !!addressObj.POBoxNumber;
                        const addressType = addressObj.Type;

                        if (addressObj.BuildingNumber && addressObj.Street) {
                            addressLine1 = `${addressObj.BuildingNumber} ${addressObj.Street}`;
                        } else if (addressObj.Line1) {
                            addressLine1 = addressObj.Line1;
                        }

                        this.updateEditStore('address1', addressLine1);
                        this.updateEditStore('address2', addressLine2);

                        if (addressLine2) {
                            this.setState({ showAddress2Input: true });
                        }

                        this.updateEditStore('city', city);
                        this.updateEditStore('postalCode', postalCode);
                        this.updateEditStore('state', state);
                        this.updateEditStore('isPOBoxAddress', isPOBoxAddress);
                        this.updateEditStore('addressType', addressType);

                        this.setState({
                            displayCityStateInputs: true,
                            isAddressVerified: true,
                            zipCodeInvalid: false,
                            cityStateZipInvalid: false
                        });
                    }
                }
            })
            // eslint-disable-next-line no-console
            .catch(err => console.log(err));
    };

    /* Hightlight address predictions term as we write on the address1 field
       based on the highlight range string sent back by Loqate address object
       Example of ranges: '5-8'
       but multiple ranges are possible: '5-8,10-15,17-18' */

    highlightAVSSearchTerm = (string, highlightStr) => {
        const highlights = highlightStr.split(';').shift();

        if (highlights) {
            let currentString = string;
            highlights.split(',').forEach(highlight => {
                const limits = highlight.split('-');
                const highlightText = string.substring(limits[0], limits[1]);
                currentString = currentString.replace(highlightText, `<b>${highlightText}</b>`);
            });

            return currentString;
        } else {
            return string;
        }
    };

    /* Hightlight the multiple units part of the address in case it exists
       For example: '525 Market St - <b>101 Addresses</b>' */

    highlightAVSUnits = string => {
        return string.replace(/\d+ Addresse?s?$/gi, '<b>$&</b>');
    };

    setHighlightedAddrIndex = (index, callback) => {
        this.setState({ highlightedAddrIndex: index }, () => {
            if (callback) {
                callback();
            }
        });
    };

    handleAddress1Change = value => {
        const sanitizedValue = sanitizeUSAddress(value);
        this.loqateWaitingFor = sanitizedValue;
        this.getLoqateAddresses(sanitizedValue);
    };

    handleAddress1ChangeDebounced = e => Debounce.debounce(this.handleAddress1Change(e.target.value), DEBOUNCE_ADDRESS);

    handleAddress1KeyUp = e => {
        const value = sanitizeUSAddress(e.target.value);
        const fieldName = e.target.name;
        this.addressInput?.setValue(value);

        this.updateEditStore(fieldName, value);

        // return early if AVS shouldn't be displayed
        if (!this.hasAVS()) {
            return;
        }

        switch (e.key) {
            case keyConsts.UP:
            case keyConsts.DOWN:
            case keyConsts.ENTER:
                e.preventDefault();

                return;
            case keyConsts.ESC:
                e.preventDefault();
                this.getLoqateAddresses(value);

                return;
            default:
                return;
        }
    };

    handleInputSanitization = e => {
        const value = sanitizeInput(e.target.value);
        const fieldName = e.target.name;

        this[fieldName]?.setValue(value);

        this.updateEditStore(fieldName, value);
    };

    // Since blur syntetic event e is returning null we can't have
    // one size fits all solution here, and apparently input an emoji
    // does not set the sanitization properly so we will force the
    // sanitization on blur for both instances of fname and lname

    handleFnameBlur = () => {
        const value = sanitizeInput(this.firstNameInput.getValue());

        this.firstNameInput.setValue(value);
    };

    handleLnameBlur = () => {
        const value = sanitizeInput(this.lastNameInput.getValue());

        this.lastNameInput.setValue(value);
    };

    handleAddress1KeyDown = e => {
        const { highlightedAddrIndex, loqateAddresses, hasAddress1Focus } = this.state;
        let index = highlightedAddrIndex;

        switch (e.key) {
            case keyConsts.TAB:
                return;
            case keyConsts.ESC:
                this.loqateWaitingFor = '';
                e.target.value = '';

                return;
            case keyConsts.UP:
                if (index <= 0) {
                    index = loqateAddresses.length - 1;
                } else {
                    index--;
                }

                break;
            case keyConsts.DOWN:
                if (index === -1 || index >= loqateAddresses.length - 1) {
                    index = 0;
                } else {
                    index++;
                }

                break;
            case keyConsts.ENTER:
                if (loqateAddresses[index]) {
                    e.preventDefault();
                    this.handleLoqateAddressClick(loqateAddresses[index]);
                }

                return;
            default:
                !hasAddress1Focus && this.handleAddress1Focus();

                return;
        }

        e.preventDefault();
        !hasAddress1Focus && this.handleAddress1Focus();
        this.setHighlightedAddrIndex(index, this.updateScrollAVS);
    };

    updateScrollAVS = pos => {
        const { highlightedAddrIndex } = this.state;
        const avsContainer = ReactDOM.findDOMNode(this.addressPrediction);

        if (!avsContainer || !avsContainer.hasChildNodes()) {
            return;
        }

        if (pos !== undefined) {
            avsContainer.scrollTop = pos;
        } else {
            const addressItemHeight = avsContainer.children[highlightedAddrIndex].offsetHeight;
            const padding = 8;
            const avsVisibleHeight = AVS_ELEMENTS_ON_VIEW * addressItemHeight;
            const currentAddressPos = highlightedAddrIndex * addressItemHeight + padding;
            const maxViewPos = avsContainer.scrollTop + avsVisibleHeight + padding;

            // is the selected address' lower point after the bottom visible area limit
            if (maxViewPos < currentAddressPos + addressItemHeight + padding) {
                avsContainer.scrollTop = currentAddressPos + addressItemHeight - avsVisibleHeight;
                // is the selected address' top point before the top visible area limit
            } else if (avsContainer.scrollTop + padding > currentAddressPos) {
                avsContainer.scrollTop = currentAddressPos - padding;
            }
        }
    };

    isAddressVerified = () => {
        return this.state.isAddressVerified;
    };

    isAddressModified = () => {
        return this.state.isAddressModified;
    };

    getHighlight = loqateAddress => {
        const { highlightTexts } = this.state;
        const highlightIndex = [];

        if (loqateAddress.Highlight.trim()) {
            return loqateAddress.Highlight;
        }

        highlightTexts.forEach(highlightText => {
            const regex = new RegExp(highlightText, 'g');
            let match;

            while ((match = regex.exec(loqateAddress.Text))) {
                highlightIndex.push(`${regex.lastIndex - match[0].length}-${regex.lastIndex}`);
            }
        });

        return highlightIndex.join(',');
    };

    render() {
        const {
            isPhoneFieldHidden,
            isBillingAddress,
            isCheckout,
            isGuestCheckout,
            orderHasPhysicalGiftCard,
            isCountryFieldHidden,
            isFrictionless,
            hasZipInASeperateLine,
            hasCustomAddressStyle
        } = this.props;

        const { displayCityStateInputs, address, isInternational, isAdsRestricted } = this.state;
        const {
            localization: { emailAddress, emailRequiredText, enterZipCodeText }
        } = this.props;

        const hasGridLayout = this.props.hasGridLayout;
        const isUS = address.country === COUNTRIES.US;

        const emailMaxLength = isAdsRestricted ? FormValidator.FIELD_LENGTHS.emailAdsRestricted : FormValidator.FIELD_LENGTHS.email;

        return (
            <div>
                <ErrorList errorMessages={this.state.errorMessages} />
                {isCheckout && isBillingAddress ? null : (
                    <Grid
                        gap={GRID_GUTTER}
                        gridTemplateColumns={hasGridLayout ? '1fr 1fr' : null}
                    >
                        <div>{this.renderFirstName()}</div>
                        <div>{this.renderLastName()}</div>
                    </Grid>
                )}
                <Grid
                    gap={isFrictionless ? [0, GRID_GUTTER] : GRID_GUTTER}
                    gridTemplateColumns={hasGridLayout ? ['1fr 1fr'] : null}
                >
                    {isCountryFieldHidden || <div css={isFrictionless && styles.fullField}>{this.renderCountry()}</div>}
                    {isPhoneFieldHidden || <div css={styles.fullField}>{this.renderPhone()}</div>}
                    {isGuestCheckout && !orderHasPhysicalGiftCard && (
                        <div css={isFrictionless && styles.fullField}>
                            <TextInput
                                type='email'
                                name='email'
                                label={emailAddress}
                                autoComplete='ship-email'
                                autoCorrect='off'
                                autoCapitalize='off'
                                spellCheck={false}
                                infoText={emailRequiredText}
                                required={true}
                                hideAsterisk={isUS}
                                maxLength={emailMaxLength}
                                value={address.email}
                                ref={comp => (this.emailInput = comp)}
                                onChange={e => this.updateEditStore(e.target.name, e.target.value)}
                                validateError={shipEmail => {
                                    if (FormValidator.isEmpty(shipEmail)) {
                                        return ErrorConstants.ERROR_CODES.EMAIL_EMPTY;
                                    }

                                    if (!FormValidator.isValidEmailAddress(shipEmail)) {
                                        return ErrorConstants.ERROR_CODES.EMAIL_INVALID;
                                    }

                                    if (!FormValidator.isValidLength(shipEmail, 5, emailMaxLength)) {
                                        return isAdsRestricted ? ErrorConstants.ERROR_CODES.EMAIL_ADS_LONG : ErrorConstants.ERROR_CODES.EMAIL_LONG;
                                    }

                                    return null;
                                }}
                                data-at={Sephora.debug.dataAt('email_input')}
                                dataAtError={Sephora.debug.dataAt('email_required_error')}
                            />
                        </div>
                    )}
                </Grid>
                <Grid gridTemplateColumns={hasCustomAddressStyle ? [null, '1fr 1fr'] : null}>{this.renderAddress1()}</Grid>
                {this.renderAddress2(hasGridLayout)}
                {hasZipInASeperateLine && displayCityStateInputs && (
                    <Grid
                        gridTemplateColumns={'1fr 1fr'}
                        gap={GRID_GUTTER}
                    >
                        {this.renderPostalCode()}
                    </Grid>
                )}
                <Grid
                    gap={GRID_GUTTER}
                    rowGap={0}
                    gridTemplateColumns={hasGridLayout ? ['1fr 1fr', displayCityStateInputs ? '1fr 1fr' : '25% 1fr 1fr'] : '11em 1fr'}
                >
                    {(!hasZipInASeperateLine || !displayCityStateInputs) && <Box gridRow={['1/2', '1/1']}>{this.renderPostalCode()}</Box>}
                    {isInternational || displayCityStateInputs ? (
                        <Box gridRow={['2/2', '1/1']}>{this.renderCity()}</Box>
                    ) : (
                        <Box
                            display='flex'
                            height={forms.HEIGHT}
                            alignItems='center'
                            lineHeight='tight'
                            fontSize={['sm', !isFrictionless && 'base']}
                            gridRow={'1/1'}
                        >
                            {enterZipCodeText}
                        </Box>
                    )}
                    <Box gridRow={['2/2', '1/1']}>{this.renderStateProvince()}</Box>
                </Grid>
            </div>
        );
    }
}

const styles = {
    avsItem: {
        display: 'flex',
        alignItems: 'center',
        padding: space[3],
        cursor: 'pointer',
        '& + *': {
            borderTop: `1px solid ${colors.lightGray}`
        }
    },
    avsItemActive: {
        position: 'relative',
        backgroundColor: colors.nearWhite
    },
    avsItemInner: {
        flex: 1
    },
    avsItemDesc: {
        color: colors.gray
    },
    fullField: {
        [mediaQueries.xsMax]: {
            gridColumn: '1 / -1'
        }
    }
};

export default wrapComponent(RwdAddressForm, 'RwdAddressForm');
