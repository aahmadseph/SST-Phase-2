import React from 'react';
import ReactDOM from 'react-dom';
import TaxFormValidator from 'components/RichProfile/MyAccount/TaxClaim/utils/TaxFormValidator';
import BaseClass from 'components/BaseClass';
import TextInput from 'components/Inputs/TextInput/TextInput';
import { wrapComponent } from 'utils/framework';
import { Box, Text } from 'components/ui';
import localeUtils from 'utils/LanguageLocale';
import { TaxClaimAddressValues } from 'components/RichProfile/MyAccount/TaxClaim/constants';
import ErrorConstants from 'utils/ErrorConstants';
import { fontSizes, colors } from 'style/config';
import LanguageLocale from 'utils/LanguageLocale';
import helperUtils from 'utils/Helpers';
import LoqateApi from 'services/api/thirdparty/Loqate';
import keyConsts from 'utils/KeyConstants';
import Chevron from 'components/Chevron';
import Debounce from 'utils/Debounce';
import { space } from 'style/config';
import addressUtils from 'utils/Address';

let debounceSubscription;
const DEBOUNCE_ADDRESS = 200;
const AVS_ELEMENTS_ON_VIEW = 6;
const GRID_GUTTER = 4;
const {
    ADDRESS1, ADDRESS2, CITY, STATE, POSTAL_CODE, COUNTRY, FIRST_NAME, LAST_NAME, PHONE_NUMBER
} = TaxClaimAddressValues;
const {
    ERROR_CODES: {
        TAX_ADDRESS_1_EMPTY, TAX_ADDRESS_2_EMPTY, TAX_CITY_EMPTY, TAX_STATE_EMPTY, TAX_ZIP_CODE_EMPTY, TAX_ZIP_CODE_INVALID
    }
} = ErrorConstants;

const postalCodeLength = TaxFormValidator.FIELD_LENGTHS.postalCode;
const zipCodeLength = TaxFormValidator.FIELD_LENGTHS.zipCode;
const { getCurrentLanguage, LANGUAGES } = LanguageLocale;
const { sanitizeUSAddress } = helperUtils;

class AddressForm extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            stateValue: this.props.state || '',
            loqateAddresses: [],
            address1: null,
            address2: null,
            city: null,
            postalCode: null,
            state: null,
            isPOBoxAddress: null,
            addressType: null,
            displayCityStateInputs: null,
            isAddressVerified: null,
            zipCodeInvalid: null,
            hasAddress1Focus: false,
            cityStateZipInvalid: null,
            addressErrors: []
        };
    }

    componentDidMount() {
        const {
            streetAddress, address2, city, postalCode, state
        } = this.props;
        this.setState({
            address1: streetAddress,
            address2: address2,
            city: city,
            postalCode: postalCode,
            state: state
        });
    }

    // eslint-disable-next-line class-methods-use-this
    componentWillUnmount() {
        clearTimeout(debounceSubscription);
    }

    appendAddressDataToStepFourReduxData = (category, objectKey, value) => {
        if (this.props.updateStep4Data) {
            this.props.updateStep4Data(category, objectKey, value);
        }
    };

    handleStateValueChange = e => {
        const selectedCategory = this.props.selectedCategory.toLowerCase();
        const value = e.target.value;
        // Always propagate the state change to the parent
        this.props.handleStateChange(value);
        this.appendAddressDataToStepFourReduxData(selectedCategory, STATE, value);
        this.validateField(STATE, value);
    };

    validateField(name, value) {
        let error;
        // 2 letter country code
        const countryLocale = localeUtils.getCurrentCountry();

        switch (name) {
            case ADDRESS1:
                error = TaxFormValidator.validateStreetAddressLine1(value);

                break;
            case ADDRESS2:
                error = TaxFormValidator.validateStreetAddressLine2(value);

                break;
            case CITY:
                error = TaxFormValidator.validateCity(value);

                break;
            case STATE:
                error = TaxFormValidator.validateState(value);

                break;
            case POSTAL_CODE:
                error = TaxFormValidator.validatePostalCode(value, countryLocale);

                break;
            default:
                break;
        }

        if (this.props.handleAddressErrorsFromStepFour) {
            this.props.handleAddressErrorsFromStepFour(name, error);
        }

        if (error) {
            this.props.addressErrors[name] = error;
        } else {
            delete this.props.addressErrors[name];
        }
    }

    getErrorMessage = errorKey => {
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/TaxClaim/locales', 'TaxClaim');

        const errorMessages = {
            taxAddress1Empty: getText(TAX_ADDRESS_1_EMPTY),
            taxAddress2Empty: getText(TAX_ADDRESS_2_EMPTY),
            taxCityEmpty: getText(TAX_CITY_EMPTY),
            taxStateEmpty: getText(TAX_STATE_EMPTY),
            taxZipCodeEmpty: getText(TAX_ZIP_CODE_EMPTY),
            taxZipCodeInvalid: getText(TAX_ZIP_CODE_INVALID)
        };

        return errorMessages[errorKey] || '';
    };

    handleAddress1Change = value => {
        const sanitizedValue = sanitizeUSAddress(value);
        this.loqateWaitingFor = sanitizedValue;
        this.getLoqateAddresses(sanitizedValue);
    };

    handleAddress1ChangeDebounced = e => Debounce.debounce(this.handleAddress1Change(e.target.value), DEBOUNCE_ADDRESS);

    handleAddress1KeyUp = e => {
        const value = sanitizeUSAddress(e.target.value);
        this.addressInput?.setValue(value);

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

    renderAddress1 = () => {
        const selectedCategory = this.props.selectedCategory.toLowerCase();
        const maxLengthVal = TaxFormValidator.FIELD_LENGTHS.address;
        const errorMessage = this.props.addressErrors.includes(TAX_ADDRESS_1_EMPTY) ? this.getErrorMessage(TAX_ADDRESS_1_EMPTY) : null;
        const hasError = Boolean(errorMessage);

        return (
            <Box position='relative'>
                <TextInput
                    name={ADDRESS1}
                    onChange={e => {
                        this.props.handleStreetAddressChange(e.target.value);
                        this.setState({ address1: e.target.value });
                        this.appendAddressDataToStepFourReduxData(selectedCategory, ADDRESS1, e.target.value);
                        this.validateField(ADDRESS1, e.target.value);
                        this.handleAddress1ChangeDebounced(e);
                    }}
                    label={localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/TaxClaim/locales', 'TaxClaim')('streetAddress')}
                    required={true}
                    hideAsterisk={true}
                    maxLength={maxLengthVal}
                    value={this.state.address1}
                    invalid={hasError}
                    message={errorMessage}
                    ref={comp => (this.addressInput = comp)}
                    onKeyUp={this.handleAddress1KeyUp}
                    onKeyDown={this.handleAddress1KeyDown}
                    onBlur={this.handleAddress1Blur}
                    onFocus={this.handleAddress1Focus}
                />
                {this.renderAVS()}
            </Box>
        );
    };

    renderAddress2 = () => {
        const selectedCategory = this.props.selectedCategory.toLowerCase();
        const maxLengthVal = TaxFormValidator.FIELD_LENGTHS.address2;
        const errorMessage = this.props.addressErrors.includes(TAX_ADDRESS_2_EMPTY) ? this.getErrorMessage(TAX_ADDRESS_2_EMPTY) : null;
        const hasError = Boolean(errorMessage);

        return (
            <Box marginBottom={GRID_GUTTER}>
                <TextInput
                    name={ADDRESS2}
                    autoComplete='address-line2'
                    autoCorrect='off'
                    onChange={e => {
                        this.props.handleAddress2Change(e.target.value);
                        this.setState({ address2: e.target.value });
                        this.appendAddressDataToStepFourReduxData(selectedCategory, ADDRESS2, e.target.value);
                        this.validateField(ADDRESS2, e.target.value);
                    }}
                    label={localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/TaxClaim/locales', 'TaxClaim')('address2Label')}
                    maxLength={maxLengthVal}
                    value={this.state.address2}
                    invalid={hasError}
                    message={errorMessage}
                />
            </Box>
        );
    };

    renderPostalCode = () => {
        const selectedCategory = this.props.selectedCategory.toLowerCase();
        const hasEmptyZipCodeError = this.props.addressErrors.includes(TAX_ZIP_CODE_EMPTY);
        const hasInvalidZipCodeError = this.props.addressErrors.includes(TAX_ZIP_CODE_INVALID);
        const isCanada = localeUtils.isCanada();
        const maxLength = isCanada ? postalCodeLength : zipCodeLength;

        const errorMessage = hasEmptyZipCodeError
            ? this.getErrorMessage(TAX_ZIP_CODE_EMPTY)
            : hasInvalidZipCodeError
                ? this.getErrorMessage(TAX_ZIP_CODE_INVALID)
                : null;

        const hasError = Boolean(errorMessage);

        return (
            <TextInput
                name={POSTAL_CODE}
                label={localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/TaxClaim/locales', 'TaxClaim')('zipCode')}
                required={true}
                maxLength={maxLength}
                hideAsterisk={true}
                value={this.state.postalCode}
                onChange={e => {
                    const formatedValue = isCanada
                        ? addressUtils.formatZipPostalCode(e.target.value, ' ', 3, 6)
                        : addressUtils.formatZipPostalCode(e.target.value, '-', 5, 9);
                    this.props.handlePostalCodeChange(formatedValue);
                    this.setState({ postalCode: formatedValue });
                    this.appendAddressDataToStepFourReduxData(selectedCategory, POSTAL_CODE, formatedValue);
                    this.validateField(POSTAL_CODE, formatedValue);
                }}
                onKeyDown={TaxFormValidator.inputAcceptOnlyAlphaNumeric}
                invalid={hasError}
                message={errorMessage}
            />
        );
    };

    renderCity = () => {
        const selectedCategory = this.props.selectedCategory.toLowerCase();
        const errorMessage = this.props.addressErrors.includes(TAX_CITY_EMPTY) ? this.getErrorMessage(TAX_CITY_EMPTY) : null;
        const value = this.state.city;
        const hasError = Boolean(errorMessage);

        return (
            <TextInput
                name={CITY}
                onChange={e => {
                    this.props.handleCityChange(e.target.value);
                    this.setState({ city: e.target.value });
                    this.appendAddressDataToStepFourReduxData(selectedCategory, CITY, e.target.value);
                    this.validateField(CITY, e.target.value);
                }}
                label={localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/TaxClaim/locales', 'TaxClaim')('city')}
                required={true}
                hideAsterisk={true}
                maxLength={TaxFormValidator.FIELD_LENGTHS.city}
                value={value}
                invalid={hasError}
                message={hasError ? errorMessage : null}
                onKeyDown={TaxFormValidator.inputAcceptOnlyLettersAndSpace}
            />
        );
    };

    renderStateProvince = () => {
        const selectedCategory = this.props.selectedCategory.toLowerCase();
        const value = this.state.state;
        const errorMessage = this.props.addressErrors.includes(TAX_STATE_EMPTY) ? this.getErrorMessage(TAX_STATE_EMPTY) : null;
        const hasError = Boolean(errorMessage);

        return (
            <TextInput
                name={STATE}
                onChange={e => {
                    this.props.handleStateChange(e.target.value);
                    this.setState({ state: e.target.value });
                    this.appendAddressDataToStepFourReduxData(selectedCategory, STATE, e.target.value);
                    this.validateField(STATE, e.target.value);
                }}
                label={localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/TaxClaim/locales', 'TaxClaim')('state')}
                required={true}
                maxLength={TaxFormValidator.FIELD_LENGTHS.stateRegion}
                hideAsterisk={true}
                value={value}
                invalid={hasError}
                message={errorMessage}
                onKeyDown={TaxFormValidator.inputAcceptOnlyAlphaNumeric}
            />
        );
    };

    renderCountry = () => {
        return (
            <Box css={styles.hidden}>
                <TextInput
                    name={COUNTRY}
                    value={this.props.country}
                />
            </Box>
        );
    };

    renderPhoneNumber = () => {
        return (
            <Box css={styles.hidden}>
                <TextInput
                    name={PHONE_NUMBER}
                    value={this.props.phoneNumber}
                />
            </Box>
        );
    };

    renderFirstName = () => {
        return (
            <Box css={styles.hidden}>
                <TextInput
                    name={FIRST_NAME}
                    value={this.props.firstName}
                />
            </Box>
        );
    };

    renderLastName = () => {
        return (
            <Box css={styles.hidden}>
                <TextInput
                    name={LAST_NAME}
                    value={this.props.lastName}
                />
            </Box>
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

    verifyLoqateAddressState = (field, value) => {
        let initialFieldValue;

        switch (field) {
            case 'address1':
            case 'address2':
            case 'postalCode':
            case 'city':
            case 'state':
                initialFieldValue = this.props[field];

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

    getLoqateAddresses = (text, container) => {
        const country = localeUtils.getCurrentCountry().toUpperCase();
        LoqateApi.findAddresses(text, country, container)
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
            .catch(error => Sephora.logger.error('Error:', error));
    };

    verifyLoqateAddress = id => {
        LoqateApi.retrieveAddress(id)
            .then(data => {
                if (data.Items && data.Items.length === 1 && typeof data.Items[0].Error !== 'undefined') {
                    Sephora.logger.error('Error:', data.Items[0].Error);
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

                        this.setState({ address1: addressLine1 });
                        this.setState({ address2: addressLine2 });

                        if (addressLine2) {
                            this.setState({ showAddress2Input: true });
                        }

                        this.setState({ city: city });
                        this.setState({ postalCode: postalCode });
                        this.setState({ state: state });
                        this.setState({ isPOBoxAddress: isPOBoxAddress });
                        this.setState({ addressType: addressType });

                        this.props.handleStreetAddressChange(addressLine1);
                        this.props.handleAddress2Change(addressLine2);
                        this.props.handleStateChange(state);
                        this.props.handleCityChange(city);
                        this.props.handlePostalCodeChange(postalCode);

                        const currentCategory = this.props.selectedCategory.toLowerCase();

                        this.props.updateStep4Data(currentCategory, 'address1', addressLine1);
                        this.props.updateStep4Data(currentCategory, 'address2', addressLine2);
                        this.props.updateStep4Data(currentCategory, 'state', state);
                        this.props.updateStep4Data(currentCategory, 'postalCode', postalCode);
                        this.props.updateStep4Data(currentCategory, 'city', city);

                        this.setState({
                            displayCityStateInputs: true,
                            isAddressVerified: true,
                            zipCodeInvalid: false,
                            cityStateZipInvalid: false
                        });
                    }
                }
            })
            .catch(error => Sephora.logger.error('Error:', error));
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

    setFieldFocus = node => {
        clearTimeout(debounceSubscription);
        ReactDOM.findDOMNode(node).querySelector('input').focus();
    };

    handleAddress1Focus = () => {
        this.addressInput?.setValue(this.state.address1);
        this.setState({ hasAddress1Focus: true });

        // Make Street address field visible above device keyboard
        if (Sephora.isMobile() && this.addressInput) {
            helperUtils.scrollTo(this.addressInput, 'input', 150, 0);
        }
    };

    handleAddress1Blur = () => {
        debounceSubscription = Debounce.debounce.call(this, this.blurAddress1, DEBOUNCE_ADDRESS)();
    };

    blurAddress1 = () => {
        this.addressInput?.setValue(this.state.address1);

        this.setState({
            hasAddress1Focus: false,
            loqateAddresses: []
        });
    };

    render() {
        const { localizedAddressTitle, addAddressErrors } = this.props;

        return (
            <React.Fragment>
                {localizedAddressTitle ? (
                    <Text
                        is='h2'
                        fontWeight='bold'
                        marginY={3}
                        fontSize={fontSizes.md}
                    >
                        {localizedAddressTitle}
                    </Text>
                ) : null}

                {addAddressErrors.length ? (
                    <Text
                        css={styles.error}
                        role='alert'
                        aria-live='assertive'
                    >
                        {addAddressErrors[0]}
                    </Text>
                ) : null}

                {this.renderFirstName()}
                {this.renderLastName()}
                {this.renderCountry()}
                {this.renderPhoneNumber()}
                {this.renderAddress1()}
                {this.renderAddress2()}
                <Box
                    display='flex'
                    justifyContent='space-between'
                    marginY={GRID_GUTTER}
                    flexWrap='wrap'
                >
                    <Box width='32%'>{this.renderPostalCode()}</Box>
                    <Box width='32%'>{this.renderCity()}</Box>
                    <Box width='32%'>{this.renderStateProvince()}</Box>
                </Box>
            </React.Fragment>
        );
    }
}

const styles = {
    hidden: {
        display: 'none'
    },
    error: {
        fontSize: fontSizes.base,
        color: colors.red
    },
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
    }
};

export default wrapComponent(AddressForm, 'TaxClaimAddressComponent', true);
