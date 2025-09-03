import ErrorConstants from 'utils/ErrorConstants';
import dateUtils from 'utils/Date';
import FormValidator from 'utils/FormValidator';

const TaxFormValidator = {
    FIELD_LENGTHS: {
        name: 30,
        firstNameAdsRestricted: 15,
        lastNameAdsRestricted: 20,
        passwordMin: 6,
        passwordMax: 12,
        zipCode: 10,
        zipCodeAdsRestricted: 5,
        postalCode: 7,
        email: 60,
        emailAdsRestricted: 50,
        address: 35,
        address2: 25,
        addressAdsRestricted: 30,
        city: 30,
        cityAdsRestricted: 20,
        annualIncomeAdsRestricted: 10, // including 2 symbols of '$' and ','
        phone: 10,
        formattedPhone: 14,
        internationalPhone: 15,
        creditCard: 19,
        creditCardExpiration: 2,
        creditCardSpaces: 4,
        securityCode: 3,
        securityCodeAmex: 4,
        giftCardNumber: 16,
        giftCardPin: 8,
        stateRegion: 20,
        biNumber: 16,
        orderId: 11,
        taxOrderId: 13,
        timeEntry: 8,
        formattedTimeEntry: 8,
        recipientName: 31,
        creditCardExpirationDate: 5,
        tribeName: 50,
        tribalIdNumber: 25,
        tribeReserveName: 50,
        tribeReserveNameMin: 1,
        registrationNumber: 35,
        registryGroupNumber: 4,
        registryBandName: 25,
        organizationPosition: 50,
        organizationName: 50,
        organizationUrl: 250,
        stateIssuedTaxExemptNumber: 50,
        phoneNumber: 50
    },

    VALIDATION_CONSTANTS: {
        FREIGHT_FORWARDER_NAME_EMPTY: 'freightForwarderNameEmpty',
        FREIGHT_FORWARDER_NAME_INVALID: 'freightForwarderNameInvalid',
        FREIGHT_FORWARDER_CERT_NUMBER_EMPTY: 'freightForwarderCertNumberEmpty',
        FREIGHT_FORWARDER_CERT_NUMBER_INVALID: 'freightForwarderCertNumberInvalid',
        DOCUMENT_NOT_UPLOADED: 'documentNotUploaded',
        UNSUPPORTED_DOCUMENT_TYPE: 'unsupportedDocumentType',
        ORDER_NOT_FOUND: 'orderNotFound',
        CLIENT_ORDER_NOT_FOUND: 'clientOrderNotFound',
        GENERIC_TAX_API_ERROR: 'genericTaxApiError',
        APPLICATION_EXISTS: 'applicationExists',
        TAX_EXEMPTION_SELECTION_EMPTY: 'taxExemptionSelectionEmpty',
        TAX_EXEMPTION_ADDRESS_ID_EMPTY: 'taxExemptionAddressIdEmpty',
        UNKNOWN_ERROR: 'unknownError'
    },

    validateOrderNumber: function (orderNumber, useGenericError = false) {
        if (!orderNumber) {
            return ErrorConstants.ERROR_CODES.ORDER_ID_EMPTY;
            // Tax feature allows 11-13 characters
        } else if (orderNumber.length < 11 || orderNumber.length > 13) {
            return ErrorConstants.ERROR_CODES.ORDER_ID_INVALID; // Error for invalid length
        } else if (useGenericError) {
            return ErrorConstants.ERROR_CODES.ORDER_ID_GENERIC; // Generic error
        } else {
            return null; // No error
        }
    },

    validateTribeName: function (tribeName, useGenericError = false) {
        if (!tribeName) {
            return ErrorConstants.ERROR_CODES.TRIBE_NAME_EMPTY;
        } else if (useGenericError) {
            return ErrorConstants.ERROR_CODES.ORDER_ID_GENERIC; // Generic error
        } else {
            return null; // No error
        }
    },

    validateTribeReserveName: function (tribeReserveName, useGenericError = false) {
        if (!tribeReserveName) {
            return ErrorConstants.ERROR_CODES.TRIBE_RESERVE_NAME_EMPTY;
        } else if (useGenericError) {
            return ErrorConstants.ERROR_CODES.ORDER_ID_GENERIC; // Generic error
        } else {
            return null; // No error
        }
    },

    validateIssueDate: function (issueDate, useGenericError = false) {
        if (!issueDate) {
            return ErrorConstants.ERROR_CODES.ISSUE_DATE_EMPTY;
        } else if (new Date(issueDate).getFullYear() < 1900 || new Date(issueDate).getFullYear() >= 2100) {
            return ErrorConstants.ERROR_CODES.ISSUE_DATE_OUT_OF_BOUNDS;
        } else if (useGenericError) {
            return ErrorConstants.ERROR_CODES.ORDER_ID_GENERIC; // Generic error
        } else {
            return null; // No error
        }
    },

    validateExpirationDate: function (expirationDate, issueDate, useGenericError = false) {
        if (!expirationDate) {
            return ErrorConstants.ERROR_CODES.EXPIRATION_DATE_EMPTY;
        } else if (expirationDate <= issueDate) {
            return ErrorConstants.ERROR_CODES.EXPIRATION_DATE_INVALID;
        } else if (new Date(expirationDate).getFullYear() < 1900 || new Date(expirationDate).getFullYear() >= 2100) {
            return ErrorConstants.ERROR_CODES.EXPIRATION_DATE_OUT_OF_BOUNDS;
        } else if (useGenericError) {
            return ErrorConstants.ERROR_CODES.ORDER_ID_GENERIC; // Generic error
        } else {
            return null; // No error
        }
    },

    validateOnlyDateGap: function (expirationDate, issueDate) {
        if (expirationDate < issueDate) {
            return ErrorConstants.ERROR_CODES.DATE_RANGE_INVALID;
        } else {
            return null; // No error
        }
    },

    validateExemptionNumber: function (exemptionNumber) {
        // Check for empty exemption number
        if (!exemptionNumber) {
            return ErrorConstants.ERROR_CODES.EXEMPTION_NUMBER_EMPTY; // Change to appropriate error code if necessary
        }

        // Define the regex pattern to match the format EXM-XXXXXXXX-XX
        const pattern = /^EXM-\d{8}-\d{2}$/;

        // Validate against the regex pattern from FIGMA
        if (!pattern.test(exemptionNumber)) {
            return ErrorConstants.ERROR_CODES.EXEMPTION_NUMBER_INVALID;
        }

        return null;
    },

    validateRegistrationNumber: function (registrationNumber) {
        if (!registrationNumber) {
            return ErrorConstants.ERROR_CODES.REGISTRATION_NUMBER_EMPTY;
        } else if (registrationNumber.length > 35 || !FormValidator.isAlphaNumeric(registrationNumber)) {
            return ErrorConstants.ERROR_CODES.REGISTRATION_NUMBER_INVALID; // Error for invalid length
        } else {
            return null; // No error
        }
    },

    validateRegistryGroup: function (registryGroupNumber) {
        if (!registryGroupNumber) {
            return ErrorConstants.ERROR_CODES.REGISTRY_GROUP_EMPTY;
        } else {
            return null; // No error
        }
    },

    validateRegistryBand: function (registryBandNumber) {
        if (!registryBandNumber) {
            return ErrorConstants.ERROR_CODES.REGISTRY_BAND_EMPTY;
        } else {
            return null; // No error
        }
    },

    validateNameOfReservation: function (nameOfReservation) {
        if (!nameOfReservation) {
            return ErrorConstants.ERROR_CODES.NAME_OF_RESERVATION_EMPTY;
        } else {
            return null; // No error
        }
    },

    validateEffectiveDate: function (effectiveDate) {
        // Check for empty effective date
        if (!effectiveDate) {
            return ErrorConstants.ERROR_CODES.EFFECTIVE_DATE_EMPTY;
        }

        const isValidDate = dateUtils.isValidDate(effectiveDate);

        // Validate against the regex pattern from FIGMA
        if (!isValidDate) {
            return ErrorConstants.ERROR_CODES.EFFECTIVE_DATE_INVALID;
        }

        return null;
    },

    validateStreetAddressLine1: function (addressLine1) {
        if (!addressLine1) {
            return ErrorConstants.ERROR_CODES.TAX_ADDRESS_1_EMPTY; // Use the new error constant
        }

        return null; // No error
    },

    validateStreetAddressLine2: function (addressLine2) {
        if (!addressLine2 || !FormValidator.isValidLength(addressLine2, 0, this.FIELD_LENGTHS.address)) {
            return ErrorConstants.ERROR_CODES.TAX_ADDRESS_2_EMPTY;
        }

        return null; // No error
    },

    validatePhoneNumber: function (phoneNumber) {
        if (!phoneNumber) {
            return ErrorConstants.ERROR_CODES.TAX_PHONE_NUMBER_EMPTY;
        }

        return null;
    },

    validateCity: function (cityValue) {
        if (!cityValue) {
            return ErrorConstants.ERROR_CODES.TAX_CITY_EMPTY;
        } else if (!FormValidator.isValidLength(cityValue, 1, this.FIELD_LENGTHS.city)) {
            return ErrorConstants.ERROR_CODES.CITY_LONG;
        }

        return null; // No error
    },

    validateState: function (stateValue) {
        if (!stateValue) {
            return ErrorConstants.ERROR_CODES.TAX_STATE_EMPTY;
        } else if (!FormValidator.isValidLength(stateValue, 1, this.FIELD_LENGTHS.stateRegion)) {
            return ErrorConstants.ERROR_CODES.STATE_LONG;
        }

        return null; // No error
    },

    validatePostalCode: function (postalCodeValue, locale = 'en-US') {
        if (!postalCodeValue) {
            return ErrorConstants.ERROR_CODES.TAX_ZIP_CODE_EMPTY;
        } else if (!FormValidator.isValidZipCode(postalCodeValue, locale)) {
            return ErrorConstants.ERROR_CODES.TAX_ZIP_CODE_INVALID;
        }

        return null; // No error
    },

    validateTaxComments: function (comments, taxCategory) {
        const OTHER = 'O';

        if (!comments && taxCategory === OTHER) {
            return ErrorConstants.ERROR_CODES.TAX_ADDITIONAL_COMMENTS_EMPTY;
        }

        return null;
    },

    validateOrganizationPosition: function (organizationPosition) {
        if (!organizationPosition) {
            return ErrorConstants.ERROR_CODES.ORGANIZATION_POSITION_EMPTY;
        } else {
            return null;
        }
    },

    validateOrganizationName: function (field) {
        if (!field) {
            return ErrorConstants.ERROR_CODES.ORGANIZATION_NAME_EMPTY;
        } else {
            return null;
        }
    },

    validateOrganizationUrl: function (field) {
        if (!field) {
            return ErrorConstants.ERROR_CODES.ORGANIZATION_URL_EMPTY;
        } else {
            return null;
        }
    },

    validateCreditCardIssued: function (field) {
        // Boolean false is a valid value
        if (field === null || field === undefined || field === '') {
            return ErrorConstants.ERROR_CODES.CREDIT_CARD_ISSUED_EMPTY;
        }

        // Allow all other values, including boolean false
        return null;
    },

    isValidLengthRateAndReview: function (inputLength, minLength, maxLength) {
        return (
            typeof inputLength !== 'undefined' &&
            inputLength !== null &&
            (!minLength || inputLength >= minLength) &&
            (!maxLength || inputLength <= maxLength)
        );
    },
    validateFreightForwarderName: function (freightForwarderName) {
        if (!freightForwarderName) {
            return this.VALIDATION_CONSTANTS.FREIGHT_FORWARDER_NAME_EMPTY;
        } else if (!FormValidator.isAlphaNumeric(freightForwarderName)) {
            return this.VALIDATION_CONSTANTS.FREIGHT_FORWARDER_NAME_INVALID;
        }

        return null;
    },
    validateFreightForwarderCertNumber: function (freightForwarderCertNumber) {
        if (!freightForwarderCertNumber) {
            return this.VALIDATION_CONSTANTS.FREIGHT_FORWARDER_CERT_NUMBER_EMPTY;
        } else if (!FormValidator.isAlphaNumeric(freightForwarderCertNumber)) {
            return this.VALIDATION_CONSTANTS.FREIGHT_FORWARDER_CERT_NUMBER_INVALID;
        }

        return null;
    },
    inputAcceptOnlyAlphaNumeric: function (e) {
        // Allow backspace, delete, tab, escape, enter, and arrow keys
        const validKeys = [46, 8, 9, 27, 13, 35, 36, 37, 38, 39, 40];
        const key = e.key;

        // Allow key events that are in the valid keys array or are alphanumeric
        if (validKeys.includes(e.keyCode) || /^[a-zA-Z0-9\-\s]$/.test(key)) {
            return true;
        } else {
            e.preventDefault();

            return false;
        }
    },
    inputAcceptURLCharacters: function (e) {
        // Allow backspace, delete, tab, escape, enter, and arrow keys
        const validKeys = [46, 8, 9, 27, 13, 35, 36, 37, 38, 39, 40];
        const key = e.key;

        // Allow alphanumeric characters and common URL symbols
        if (validKeys.includes(e.keyCode) || /^[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]$/.test(key)) {
            return true;
        } else {
            e.preventDefault();

            return false;
        }
    },
    inputAcceptOnlyLettersAndSpace: function (e) {
        // Allowed key codes for common non-character actions (e.g., backspace, delete, tab, etc.)
        const validKeys = [46, 8, 9, 27, 13, 35, 36, 37, 38, 39, 40];
        const key = e.key;

        // Allow key events that are in the valid keys array or are alphabetic letters and space
        if (validKeys.includes(e.keyCode) || /^[a-zA-Z\s]$/.test(key)) {
            return true;
        } else {
            e.preventDefault(); // Prevent any other key press

            return false;
        }
    },

    pasteAcceptURLCharacters: function (event) {
        // Get pasted data via clipboard API
        const clipboardData = event.clipboardData || global.clipboardData;
        const pastedData = clipboardData.getData('Text');

        // Regular expression to allow alphanumeric characters and common URL symbols
        const urlRegex = /^[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]+$/;

        if (!urlRegex.test(pastedData)) {
            event.stopPropagation();
            event.preventDefault();

            return false;
        }

        return true;
    },
    validateSubmitApiErrors(errorCode) {
        switch (errorCode) {
            case 'document.not.uploaded':
                return this.VALIDATION_CONSTANTS.DOCUMENT_NOT_UPLOADED;
            case 'unsupported.document.type':
                return this.VALIDATION_CONSTANTS.UNSUPPORTED_DOCUMENT_TYPE;
            case 'order.not.found':
                return this.VALIDATION_CONSTANTS.ORDER_NOT_FOUND;
            default:
                return this.VALIDATION_CONSTANTS.GENERIC_TAX_API_ERROR;
        }
    },
    validateInitApiErrors(reasonCode) {
        if (!reasonCode) {
            return null;
        }

        switch (reasonCode) {
            case 'client.pending.application.exists':
                return this.VALIDATION_CONSTANTS.APPLICATION_EXISTS;
            case 'client.order.not.found':
                return this.VALIDATION_CONSTANTS.CLIENT_ORDER_NOT_FOUND;
            default:
                return this.VALIDATION_CONSTANTS.UNKNOWN_ERROR;
        }
    },
    validateTaxExemptionSelection(taxExemptionSelection) {
        if (taxExemptionSelection === null) {
            return this.VALIDATION_CONSTANTS.TAX_EXEMPTION_SELECTION_EMPTY;
        }

        return null;
    },
    validateTaxExemptionAddressId(addressId) {
        if (!addressId) {
            return this.VALIDATION_CONSTANTS.TAX_EXEMPTION_ADDRESS_ID_EMPTY;
        }

        return null;
    }
};

export default TaxFormValidator;
