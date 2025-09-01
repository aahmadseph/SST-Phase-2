import ErrorConstants from 'utils/ErrorConstants';
import UI from 'utils/UI';
import RegEx from 'components/Markdown/RegEx';

const FormValidator = {
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
        giftCardNumber: 19, // 16 + 3 spaces for 4 4 4 4 format
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
        registrationNumber: 35,
        registryGroupNumber: 4,
        registryBandName: 25,
        organizationPosition: 50,
        organizationName: 50,
        organizationUrl: 250,
        stateIssuedTaxExemptNumber: 50,
        phoneNumber: 50
    },

    isEmpty: function (value) {
        const isEmpty = !value || value.trim() === '';

        return isEmpty || value === ErrorConstants.TEXT_INPUT_MESSAGE;
    },

    isValidLength: function (value, minLength, maxLength) {
        return (
            typeof value !== 'undefined' && value !== null && (!minLength || value.length >= minLength) && (!maxLength || value.length <= maxLength)
        );
    },

    /**
     * Note that our test for validity is much stricter than RFC-5322's definition
     * @param el
     * @returns {boolean}
     */
    isValidEmailAddress: function (login) {
        const pattern = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/i;

        return pattern.test(login);
    },

    hasEmptySpaces: function (value) {
        return value.indexOf(' ') > -1;
    },

    isAlphaNumeric: function (value) {
        // Upper, lower, space and nums
        const pattern = /^[a-zA-Z0-9 ]+$/;

        return pattern.test(value);
    },

    isAlphabetsOnly: function (value) {
        const pattern = /^[a-zA-Z ]+$/gi;

        return pattern.test(value);
    },

    isNumeric: function (value) {
        const pattern = /^[0-9]+$/gi;

        return pattern.test(value);
    },

    //has any non printable character except for newline
    hasNonPrintableCharacter: function (value) {
        const pattern = /(?!\n)[^ -~‘’“”]+/g;

        return pattern.test(value);
    },

    getErrors: function (fieldComps) {
        const errors = {
            fields: [],
            messages: []
        };
        let firstErrorIndex = null;
        let index = 1;

        fieldComps.forEach(function (comp) {
            if (comp && comp.validateError) {
                const message = comp.validateError();

                if (message) {
                    if (!firstErrorIndex) {
                        firstErrorIndex = index;
                    }

                    errors.fields.push(comp.props.name);
                    errors.messages.push(message);
                }
            }

            index++;
        });

        if (firstErrorIndex) {
            errors.errorIndex = firstErrorIndex;
        }

        return errors;
    },

    replaceDotSeparator: function (value, ref) {
        let outputValue = value;

        if (UI.isAndroid()) {
            outputValue = outputValue.replace('.', '');
            ref.setValue(outputValue);
        }

        return outputValue;
    },

    inputAcceptOnlyNumbers: function (e) {
        // Allow: Backspace, Tab, Enter, Escape, Delete
        const validKeyCodes = [8, 9, 13, 27, 46];

        // Allow: Ctrl/cmd + A/C/V/X/Z
        if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x', 'z'].includes(e.key.toLowerCase())) {
            return true;
        }

        // Allow navigation keys: arrows, home, end
        if (e.keyCode >= 35 && e.keyCode <= 40) {
            return true;
        }

        // Allow number keys (0–9)
        if (/^[0-9]$/.test(e.key)) {
            return true;
        }

        // Allow validKeyCodes
        if (validKeyCodes.includes(e.keyCode)) {
            return true;
        }

        // Block everything else
        e.preventDefault();

        return false;
    },

    inputAcceptOnlyAlphaNumeric: function (e) {
        // Allow backspace, delete, tab, escape, enter and arrow keys
        const validKeys = [46, 8, 9, 27, 13, 35, 36, 37, 38, 39, 40];

        // Check if the pressed key is a letter or number
        if (!validKeys.includes(e.keyCode) && !(e.keyCode >= 65 && e.keyCode <= 90) && !(e.keyCode >= 48 && e.keyCode <= 57)) {
            e.preventDefault();

            return false;
        }

        return true;
    },

    pasteAcceptOnlyNumbers: function (event) {
        // Get pasted data via clipboard API
        const clipboardData = event.clipboardData || global.clipboardData;
        const pastedData = clipboardData.getData('Text');

        if (pastedData.match(/^\d*$/g) === null) {
            event.stopPropagation();
            event.preventDefault();

            return false;
        }

        return true;
    },

    pasteAcceptOnlyAlphaNumeric: function (event) {
        // Get pasted data via clipboard API
        const clipboardData = event.clipboardData || global.clipboardData;
        const pastedData = clipboardData.getData('Text');

        // Regular expression to match only letters and numbers
        const alphaNumericRegex = /^[a-zA-Z0-9]+$/;

        if (!alphaNumericRegex.test(pastedData)) {
            event.stopPropagation();
            event.preventDefault();

            return false;
        }

        return true;
    },

    isValidZipCode: function (value, locale) {
        const US_RE = /^\d{5}(-\d{4})?$/;
        const CA_RE = /^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$/i;

        if (locale === 'CA') {
            return CA_RE.test(value);
        } else {
            return US_RE.test(value);
        }
    },

    isValidCreditCardMonth: function (value) {
        const num = parseInt(value, 10);

        return num > 0 && num <= 12;
    },

    isValidCreditCardYear: function (value) {
        const currentYear = new Date().getFullYear();
        const twoDigitYear = currentYear % 100;

        const num = parseInt(value, 10);

        return num < twoDigitYear;
    },

    getFormattedPhoneNumber: function (rawValue) {
        if (rawValue && rawValue.length > 3 && rawValue.length <= 6) {
            // add parentheses if 4-6 characters have been entered
            return `(${rawValue.slice(0, 3)}) ${rawValue.slice(3)}`;
        } else if (rawValue && rawValue.length > 6) {
            // add hyphen if character count is greater than 6
            return `(${rawValue.slice(0, 3)}) ${rawValue.slice(3, 6)}-${rawValue.slice(6)}`;
        }

        // remove parantheses if 3 or fewer characters
        return '';
    },

    getRawPhoneNumber(formattedPhoneNumber) {
        return formattedPhoneNumber.replace(RegEx.matchPhoneSpecialChars, '');
    },

    isValidPhoneNumber: function (phoneNumber) {
        return (
            !RegEx.matchIfCharsAreTheSame.test(this.getRawPhoneNumber(phoneNumber)) &&
            phoneNumber.length === FormValidator.FIELD_LENGTHS.formattedPhone
        );
    },

    isValidName: function (value) {
        const pattern = /^[a-zA-ZÀ-ÖØ-öø-ÿ \-'—'–'"`'‘’“”]+$/u;

        return pattern.test(value);
    },
    isValidLengthRateAndReview: function (inputLength, minLength, maxLength) {
        return (
            typeof inputLength !== 'undefined' &&
            inputLength !== null &&
            (!minLength || inputLength >= minLength) &&
            (!maxLength || inputLength <= maxLength)
        );
    }
};

export default FormValidator;
