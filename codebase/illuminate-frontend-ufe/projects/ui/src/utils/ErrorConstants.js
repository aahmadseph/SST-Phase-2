/* eslint max-len: [2, 200] */
import localeUtils from 'utils/LanguageLocale';

const getTextFunction = localeUtils.getLocaleResourceFile('utils/locales', 'ErrorConstants');
const getText = key => () => getTextFunction(key);

const HARDCODED = 'HARDCODED';

// All levels, where error can be raised. Each level is stored in separate Store
const ERROR_LEVEL = {
    FIELD: 'FIELD',
    FORM: 'FORM',
    GLOBAL: 'GLOBAL'
};

// These are the backend global errors that should not show as modals but rather as inline errors
const INLINE_ERRORS = [-10170];

const ERROR_KEYS = { SAME_DAY_DISABLED: -7, SDU_MISSING_PROFILE_DETAILS: -9, NCR_DECLINED: -1200, INVALID_NCR_ORDER: -1500 };

const INLINE_ERROR_KEYS = ['sameDaySkuOOSException', 'sameDayException', 'invalidAddress', 'itemQuantityUpdated'];

// Describes all the possible errors by code. Back end code is key\identifier in backend response
const ERROR_CODES = {
    UNKNOWN: 'UNKNOWN',
    FIRST_NAME: 'FIRST_NAME',
    LAST_NAME: 'LAST_NAME',
    ADDRESS1: 'ADDRESS1',
    ZIP_CODE_US: 'ZIP_CODE_US',
    ZIP_CODE_NON_US: 'ZIP_CODE_NON_US',
    INVALID_ZIP_CODE: 'INVALID_ZIP_CODE',
    CITY: 'CITY',
    CITY_INVALID: 'CITY_INVALID',
    STATE: 'STATE',
    PHONE_NUMBER: 'PHONE_NUMBER',
    PHONE_NUMBER_INVALID: 'PHONE_NUMBER_INVALID',
    PHONE_NUMBER_INVALID_REGISTRATION: 'PHONE_NUMBER_INVALID_REGISTRATION',
    MOBILE_NUMBER: 'MOBILE_NUMBER',
    MOBILE_NUMBER_INVALID: 'MOBILE_NUMBER_INVALID',
    ALTERNATIVE_NUMBER: 'ALTERNATIVE_NUMBER',
    ALTERNATIVE_NUMBER_INVALID: 'ALTERNATIVE_NUMBER_INVALID',
    CREDIT_CARD_NUMBER: 'CREDIT_CARD_NUMBER',
    CREDIT_CARD_PIN: 'CREDIT_CARD_PIN',
    CREDIT_CARD_EXP_MONTH: 'CREDIT_CARD_EXP_MONTH',
    CREDIT_CARD_EXP_MONTH_INVALID: 'CREDIT_CARD_EXP_MONTH_INVALID',
    CREDIT_CARD_EXP_YEAR: 'CREDIT_CARD_EXP_YEAR',
    CREDIT_CARD_EXP_DATE: 'CREDIT_CARD_EXP_DATE',
    CREDIT_CARD_SECURITY_CODE: 'CREDIT_CARD_SECURITY_CODE',
    CREDIT_CARD_CVV_VALIDATION: 'CREDIT_CARD_CVV_VALIDATION',
    CREDIT_CARD_SECURITY_CODE_LENGTH: 'CREDIT_CARD_SECURITY_CODE_LENGTH',
    EDIT_GIFT_CARD_IS_NOT_EMPTY: 'EDIT_GIFT_CARD_IS_NOT_EMPTY',
    PASSWORD: 'PASSWORD',
    CAPTCHA: 'CAPTCHA',
    JOIN_BI: 'JOIN_BI',
    JOIN_BI_BIRTHDAY: 'JOIN_BI_BIRTHDAY',
    JOIN_BI_MONTH: 'JOIN_BI_MONTH',
    JOIN_BI_DATE: 'JOIN_BI_DATE',
    EMAIL_EMPTY: 'EMAIL_EMPTY',
    EMAIL_INVALID: 'EMAIL_INVALID',
    IN_STORE_USER: 'IN_STORE_USER',
    RESTRICTED_SHIPPING: 'restrictedShipping',
    SHIPPING_METHOD_NOT_FOUND: 'shippingMethodsNotFound',
    LOOKUP_CITY_INVALID: 'city',
    LOOKUP_STATE_INVALID: 'state',
    LOOKUP_POSTAL_CODE_INVALID: 'postalCode',
    FOREIGN_POSTAL_CODE_INVALID: 'foreignZipCode',
    EXPIRATION_MONTH_INVALID: 'expirationMonth',
    CREDIT_CARD_NUMBER_INVALID: 'creditCardNumber',
    PROMO_INVALID: 'basketLevelMsg', // TODO: make it more specific
    GIFT_CARD_NOT_ENOUGH: 'payment.GC.not.enough',
    ERROR_APPLYING_GIFT_CARD: 'errorApplyingGiftCard',
    VISA_INVALID_CVV: 'visaExpressCVNCode',
    AMEX_INVALID_CVV: 'americanExpressCVNCode',
    CREDIT_CARD_IS_INVALID: 'creditCardType',
    EXPRESS_INVALID_CVV: 'expressCVNCode',
    SHIPPING_METHODS_NOT_FOUND: 'shippingMethodsNotFound',
    CHECKOUT_PAYMENT_INCOMPLETE: 'checkoutPaymentIncomplete',
    CHECKOUT_PAYMENT_GIFT_CARD_NOT_ENOUGH: 'checkoutPaymentGiftCardNotEnough',
    CHECKOUT_PAYMENT_STORE_CREDIT_NOT_ENOUGH: 'checkoutPaymentStoreCreditNotEnough',
    CHECKOUT_PAYMENT_GIFT_CARD_NOT_APPLIED: 'checkoutPaymentGiftCardNotApplied',
    ADDRESS1_INCORRECT: 'address1',
    ADDRESS2_INCORRECT: 'address2',
    FIRST_NAME_INCORRECT: 'firstName',
    LAST_NAME_INCORRECT: 'lastName',
    GIFT_CARD_MESSAGE: 'giftCardMessage',
    INVALID_SHIPPING_GROUP: 'invalidShippingGroup',
    SOCIAL_SECURITY: 'socialSecurity',
    SOCIAL_SECURITY_INVALID: 'socialSecurityInvalid',
    ANNUAL_INCOME: 'annualIncome',
    ORDER_ID_EMPTY: 'orderIdEmpty',
    ORDER_ID_INVALID: 'orderIdInvalid',
    ORDER_ID_NOT_FOUND: 'orderIdNotFound',
    ORDER_ID_GENERIC: 'orderIdGeneric',
    EMAIL_SUBJECT_REQUIRED: 'EMAIL_SUBJECT_REQUIRED',
    GIFT_CARD_NUMBER: 'gcNumber',
    GIFT_CARD_LENGTH: 'gcLength',
    GIFT_CARD_PIN: 'gcPin',
    GIFT_CARD_PIN_LENGTH: 'gcPinLength',
    APPLY_FORM_SECTION: 'APPLY_FORM_SECTION',
    AGE_LIMIT_18: 'AGE_LIMIT_18',
    FIRST_NAME_ADS_LONG: 'FIRST_NAME_ADS_LONG',
    FIRST_NAME_LONG: 'FIRST_NAME_LONG',
    LAST_NAME_ADS_LONG: 'LAST_NAME_ADS_LONG',
    LAST_NAME_LONG: 'LAST_NAME_LONG',
    EMAIL_ADS_LONG: 'EMAIL_ADS_LONG',
    EMAIL_LONG: 'EMAIL_LONG',
    CITY_ADS_LONG: 'CITY_ADS_LONG',
    CITY_LONG: 'CITY_LONG',
    ADDRESS1_ADS_LONG: 'ADDRESS1_ADS_LONG',
    ZIPCODE_ADS_LONG: 'ZIPCODE_ADS_LONG',
    ADDRESS1_LONG: 'ADDRESS1_LONG',
    ANNUAL_INCOME_ADS_LONG: 'ANNUAL_INCOME_ADS_LONG',
    SOCIAL_SECURITY_ZEROS: 'SOCIAL_SECURITY_ZEROS',
    TIME: 'TIME',
    INVALID_ORDER: 'invalidOrder',
    NOT_ENOUGH_BI_POINTS: 'ProcValidateOrderForCheckout',
    NOT_ENOUGH_POINTS_ERROR: 'NOT_ENOUGH_POINTS_ERROR',
    INVALID_ADDRESS: 'invalidAddress',
    SAME_DAY_SKU_OOS_EXCEPTION: 'sameDaySkuOOSException',
    ADDRESS_IN_USE: 'addressInUse',
    CARD_IN_USE: 'cardInUse',
    MARKETING_PHONE_NUMBER: 'MARKETING_PHONE_NUMBER',
    TS_HEADER_ERROR: 421,
    GIFT_CARD_NUMBER_REQUIRED: 'giftCardNumber',
    GIFT_CARD_PIN_REQUIRED: 'giftCardPIN',
    TRIBE_NAME_EMPTY: 'tribeNameEmpty',
    TRIBE_RESERVE_NAME_EMPTY: 'tribeReserveNameEmpty',
    ISSUE_DATE_EMPTY: 'issueDateEmpty',
    ISSUE_DATE_OUT_OF_BOUNDS: 'issueDateOutOfBounds',
    EXPIRATION_DATE_EMPTY: 'expirationDateEmpty',
    EXPIRATION_DATE_INVALID: 'expirationDateInvalid',
    EXPIRATION_DATE_OUT_OF_BOUNDS: 'expirationDateOutOfBounds',
    EXEMPTION_NUMBER_EMPTY: 'taxExemptionNumberEmpty',
    EXEMPTION_NUMBER_INVALID: 'taxExemptionNumberInvalid',
    EFFECTIVE_DATE_EMPTY: 'taxEffectiveDateEmpty',
    EFFECTIVE_DATE_INVALID: 'taxEffectiveDateInvalid',
    TAX_ADDRESS_1_EMPTY: 'taxAddress1Empty',
    TAX_ADDRESS_2_EMPTY: 'taxAddress2Empty',
    TAX_PHONE_NUMBER_EMPTY: 'taxPhoneNumberEmpty',
    TAX_CITY_EMPTY: 'taxCityEmpty',
    TAX_STATE_EMPTY: 'taxStateEmpty',
    TAX_ZIP_CODE_EMPTY: 'taxZipCodeEmpty',
    TAX_ZIP_CODE_INVALID: 'taxZipCodeInvalid',
    TAX_ADDITIONAL_COMMENTS_EMPTY: 'taxAdditionalCommentsEmpty',
    TAX_ELIGIBLE_ORDERS_EMPTY: 'taxEligibleOrdersEmpty',
    REGISTRATION_NUMBER_EMPTY: 'registrationNumberEmpty',
    REGISTRATION_NUMBER_INVALID: 'registrationNumberInvalid',
    REGISTRY_GROUP_EMPTY: 'registryGroupEmpty',
    REGISTRY_BAND_EMPTY: 'registryBandNameEmpty',
    NAME_OF_RESERVATION_EMPTY: 'nameOfReservationEmpty',
    DATE_RANGE_INVALID: 'dateRangeInvalid',
    ORGANIZATION_POSITION_EMPTY: 'organizationPositionEmpty',
    ORGANIZATION_NAME_EMPTY: 'organizationNameEmpty',
    ORGANIZATION_URL_EMPTY: 'organizationUrlEmpty',
    CREDIT_CARD_ISSUED_EMPTY: 'creditCardIssuedEmpty',
    CREDIT_CARD_NUMBER_REQUIRED: 'CREDIT_CARD_NUMBER_REQUIRED',
    CREDIT_CARD_NUMBER_INCORRECT: 'CREDIT_CARD_NUMBER_INCORRECT',
    CREDIT_CARD_EXP_MONTH_REQUIRED: 'CREDIT_CARD_EXP_MONTH_REQUIRED',
    CREDIT_CARD_EXP_MONTH_INCORRECT: 'CREDIT_CARD_EXP_MONTH_INCORRECT',
    CREDIT_CARD_EXP_YEAR_REQUIRED: 'CREDIT_CARD_EXP_YEAR_REQUIRED',
    CREDIT_CARD_EXP_YEAR_INCORRECT: 'CREDIT_CARD_EXP_YEAR_INCORRECT',
    CREDIT_CARD_CVV_REQUIRED: 'CREDIT_CARD_CVV_REQUIRED',
    CREDIT_CARD_CVV_INCORRECT: 'CREDIT_CARD_CVV_INCORRECT',
    CREDIT_CARD_FIRST_NAME_REQUIRED: 'CREDIT_CARD_FIRST_NAME_REQUIRED',
    CREDIT_CARD_LAST_NAME_REQUIRED: 'CREDIT_CARD_LAST_NAME_REQUIRED',
    ADDRESS_PHONE_REQUIRED: 'ADDRESS_PHONE_REQUIRED',
    ADDRESS_STREET_REQUIRED: 'ADDRESS_STREET_REQUIRED',
    ADDRESS_ZIPCODE_REQUIRED: 'ADDRESS_ZIPCODE_REQUIRED',
    ADDRESS_ZIPCODE_INCORRECT: 'ADDRESS_ZIPCODE_INCORRECT',
    ADDRESS_CITY_REQUIRED: 'ADDRESS_CITY_REQUIRED',
    ADDRESS_CITY_INCORRECT: 'ADDRESS_CITY_INCORRECT',
    CHECKOUT_GENERIC_ERROR: 'checkout.cc.auth.generic.error'
};

// place where error can be put in component\field
const ERROR_LOCATION = {
    AFTER: 'AFTER',
    BEFORE: 'BEFORE',
    REPLACE: 'REPLACE'
};

const INTERSTICE_DEFAULT_TIMEOUT_MS = 100;

const TEXT_INPUT_MESSAGE = 'error';

// Collection of predefined errors setup with possible messages, level of error,
// name (for analytics naming errors),
// label, message can be a function, called with component properties
const ERRORS = {
    [ERROR_CODES.UNKNOWN]: { level: ERROR_LEVEL.FORM },
    [ERROR_CODES.FIRST_NAME]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.FIRST_NAME_ADS_LONG]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.FIRST_NAME_LONG]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.LAST_NAME]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.LAST_NAME_ADS_LONG]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.LAST_NAME_LONG]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.ADDRESS1_ADS_LONG]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.ADDRESS1_LONG]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.ADDRESS1]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.ZIP_CODE_US]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.ZIP_CODE_NON_US]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.INVALID_ZIP_CODE]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.ZIPCODE_ADS_LONG]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.CITY]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.CITY_LONG]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.CITY_ADS_LONG]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.CITY_INVALID]: {
        level: ERROR_LEVEL.FIELD,
        message: true
    },
    [ERROR_CODES.STATE]: {
        level: ERROR_LEVEL.FIELD,
        message: params => getText(params.isCanada ? 'STATE_A' : 'STATE_B')()
    },
    [ERROR_CODES.PHONE_NUMBER]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.PHONE_NUMBER_INVALID]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.PHONE_NUMBER_INVALID_REGISTRATION]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED,
        name: 'bi registration:phone'
    },
    [ERROR_CODES.MOBILE_NUMBER]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.ALTERNATIVE_NUMBER]: {
        level: ERROR_LEVEL.FIELD,
        message: true
    },
    [ERROR_CODES.MOBILE_NUMBER_INVALID]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.ALTERNATIVE_NUMBER_INVALID]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.CREDIT_CARD_NUMBER]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.CREDIT_CARD_PIN]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.CREDIT_CARD_EXP_MONTH]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.CREDIT_CARD_EXP_YEAR]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },

    [ERROR_CODES.CREDIT_CARD_EXP_DATE]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.CREDIT_CARD_EXP_MONTH_INVALID]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.CREDIT_CARD_SECURITY_CODE]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.CREDIT_CARD_CVV_VALIDATION]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.CREDIT_CARD_SECURITY_CODE_LENGTH]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.PASSWORD]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.CAPTCHA]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.JOIN_BI]: {
        level: ERROR_LEVEL.FORM,
        message: HARDCODED,
        name: 'joinBiCheckbox'
    },
    [ERROR_CODES.JOIN_BI_BIRTHDAY]: {
        level: ERROR_LEVEL.FORM,
        message: HARDCODED,
        name: 'birthDate'
    },
    [ERROR_CODES.JOIN_BI_MONTH]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED,
        name: 'biMonth'
    },
    [ERROR_CODES.JOIN_BI_DATE]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED,
        name: 'biDay'
    },
    [ERROR_CODES.AGE_LIMIT_18]: {
        level: ERROR_LEVEL.FORM,
        message: HARDCODED,
        name: 'birthDate'
    },
    [ERROR_CODES.EDIT_GIFT_CARD_IS_NOT_EMPTY]: {
        level: ERROR_LEVEL.FORM,
        message: HARDCODED
    },
    [ERROR_CODES.EMAIL_EMPTY]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.EMAIL_INVALID]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.EMAIL_ADS_INVALID]: { message: HARDCODED },
    [ERROR_CODES.EMAIL_LONG]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.EMAIL_ADS_LONG]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.IN_STORE_USER]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED,
        name: 'inStore'
    },
    [ERROR_CODES.RESTRICTED_SHIPPING]: {
        level: ERROR_LEVEL.GLOBAL,
        label: 'shippingRestriction'
    },
    [ERROR_CODES.SHIPPING_METHOD_NOT_FOUND]: {
        level: ERROR_LEVEL.GLOBAL,
        label: 'shippingRestriction'
    },
    [ERROR_CODES.LOOKUP_CITY_INVALID]: { level: ERROR_LEVEL.FIELD },
    [ERROR_CODES.LOOKUP_POSTAL_CODE_INVALID]: { level: ERROR_LEVEL.FIELD },
    [ERROR_CODES.LOOKUP_STATE_INVALID]: { level: ERROR_LEVEL.FIELD },
    [ERROR_CODES.CREDIT_CARD_NUMBER_INVALID]: { level: ERROR_LEVEL.FIELD },
    [ERROR_CODES.EXPIRATION_MONTH_INVALID]: { level: ERROR_LEVEL.FIELD },
    [ERROR_CODES.PROMO_INVALID]: { level: ERROR_LEVEL.FIELD },
    [ERROR_CODES.GIFT_CARD_NOT_ENOUGH]: { level: ERROR_LEVEL.FORM },
    [ERROR_CODES.ERROR_APPLYING_GIFT_CARD]: { level: ERROR_LEVEL.FORM },
    [ERROR_CODES.FOREIGN_POSTAL_CODE_INVALID]: { level: ERROR_LEVEL.FORM },
    [ERROR_CODES.VISA_INVALID_CVV]: { level: ERROR_LEVEL.FIELD },
    [ERROR_CODES.AMEX_INVALID_CVV]: { level: ERROR_LEVEL.FIELD },
    [ERROR_CODES.EXPRESS_INVALID_CVV]: { level: ERROR_LEVEL.FIELD },
    [ERROR_CODES.SHIPPING_METHODS_NOT_FOUND]: {
        level: ERROR_LEVEL.FORM,
        label: 'shippingRestriction'
    },
    [ERROR_CODES.CHECKOUT_PAYMENT_INCOMPLETE]: {
        level: ERROR_LEVEL.FORM,
        message: HARDCODED
    },
    [ERROR_CODES.CHECKOUT_PAYMENT_GIFT_CARD_NOT_ENOUGH]: {
        level: ERROR_LEVEL.FORM,
        message: HARDCODED
    },
    [ERROR_CODES.CHECKOUT_PAYMENT_STORE_CREDIT_NOT_ENOUGH]: {
        level: ERROR_LEVEL.FORM,
        message: HARDCODED
    },
    [ERROR_CODES.CHECKOUT_PAYMENT_GIFT_CARD_NOT_APPLIED]: {
        level: ERROR_LEVEL.FORM,
        message: HARDCODED
    },
    [ERROR_CODES.CREDIT_CARD_IS_INVALID]: { level: ERROR_LEVEL.FIELD },
    [ERROR_CODES.ADDRESS1_INCORRECT]: { level: ERROR_LEVEL.FIELD },
    [ERROR_CODES.ADDRESS2_INCORRECT]: { level: ERROR_LEVEL.FIELD },
    [ERROR_CODES.FIRST_NAME_INCORRECT]: { level: ERROR_LEVEL.FIELD },
    [ERROR_CODES.LAST_NAME_INCORRECT]: { level: ERROR_LEVEL.FIELD },
    [ERROR_CODES.GIFT_CARD_MESSAGE]: { level: ERROR_LEVEL.FORM },
    [ERROR_CODES.INVALID_SHIPPING_GROUP]: { level: ERROR_LEVEL.FORM },
    [ERROR_CODES.SOCIAL_SECURITY_INVALID]: {
        level: ERROR_LEVEL.FORM,
        message: HARDCODED
    },
    [ERROR_CODES.SOCIAL_SECURITY_ZEROS]: {
        level: ERROR_LEVEL.FORM,
        message: HARDCODED
    },
    [ERROR_CODES.ANNUAL_INCOME]: {
        level: ERROR_LEVEL.FORM,
        message: HARDCODED
    },
    [ERROR_CODES.ANNUAL_INCOME_ADS_LONG]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.ORDER_ID_EMPTY]: {
        level: ERROR_LEVEL.FIELD,
        message: params => (params && params.emptyOrderIdError) || getText('orderIdEmpty')()
    },
    [ERROR_CODES.ORDER_ID_INVALID]: {
        level: ERROR_LEVEL.FIELD,
        message: params => (params && params.invalidOrderIdError) || getText('orderIdInvalid')()
    },
    [ERROR_CODES.ORDER_ID_NOT_FOUND]: {
        level: ERROR_LEVEL.FIELD,
        message: params => (params && params.orderNotFOundError) || getText('orderIdNotFound')()
    },
    [ERROR_CODES.ORDER_ID_GENERIC]: {
        level: ERROR_LEVEL.FIELD,
        message: params => (params && params.genericOrderIdError) || getText('orderIdGeneric')()
    },
    [ERROR_CODES.EXEMPTION_NUMBER_EMPTY]: {
        level: ERROR_LEVEL.FIELD,
        message: params => (params && params.emptyTaxExemptionError) || getText('taxExemptionNumberEmpty')()
    },
    [ERROR_CODES.EXEMPTION_NUMBER_INVALID]: {
        level: ERROR_LEVEL.FIELD,
        message: params => (params && params.invalidTaxExemptionError) || getText('taxExemptionNumberInvalid')()
    },
    [ERROR_CODES.EFFECTIVE_DATE_EMPTY]: {
        level: ERROR_LEVEL.FIELD,
        message: params => (params && params.emptyTaxEffectiveDateError) || getText('taxEffectiveDateEmpty')()
    },
    [ERROR_CODES.EFFECTIVE_DATE_INVALID]: {
        level: ERROR_LEVEL.FIELD,
        message: params => (params && params.invalidTaxEffectiveDateError) || getText('taxEffectiveDateInvalid')()
    },
    [ERROR_CODES.TAX_ADDRESS_1_EMPTY]: {
        level: ERROR_LEVEL.FIELD,
        message: params => (params && params.emptyTaxAddressError) || getText('taxAddress1Empty')()
    },
    [ERROR_CODES.TAX_ADDRESS_2_EMPTY]: {
        level: ERROR_LEVEL.FIELD,
        message: params => (params && params.emptyTaxAddress2Error) || getText('taxAddress2Empty')()
    },
    [ERROR_CODES.TAX_CITY_EMPTY]: {
        level: ERROR_LEVEL.FIELD,
        message: params => (params && params.emptyTaxCityError) || getText('taxCityEmpty')()
    },
    [ERROR_CODES.TAX_STATE_EMPTY]: {
        level: ERROR_LEVEL.FIELD,
        message: params => (params && params.emptyTaxStateError) || getText('taxStateEmpty')()
    },
    [ERROR_CODES.TAX_ZIP_CODE_EMPTY]: {
        level: ERROR_LEVEL.FIELD,
        message: params => (params && params.emptyTaxZipCodeError) || getText('taxZipCodeEmpty')()
    },
    [ERROR_CODES.TAX_ADDITIONAL_COMMENTS_EMPTY]: {
        level: ERROR_LEVEL.FIELD,
        message: params => (params && params.emptyTaxCommentsError) || getText('taxAdditionalCommentsEmpty')()
    },
    [ERROR_CODES.ISSUE_DATE_EMPTY]: {
        level: ERROR_LEVEL.FIELD,
        message: params => (params && params.emptyIssueDateError) || getText('issueDateEmpty')()
    },
    [ERROR_CODES.EXPIRATION_DATE_EMPTY]: {
        level: ERROR_LEVEL.FIELD,
        message: params => (params && params.emptyExpirationDateError) || getText('expirationDateEmpty')()
    },
    [ERROR_CODES.ISSUE_DATE_OUT_OF_BOUNDS]: {
        level: ERROR_LEVEL.FIELD,
        message: params => (params && params.outOfBoundsIssueDateError) || getText('dateOutOfBounds')()
    },
    [ERROR_CODES.EXPIRATION_DATE_OUT_OF_BOUNDS]: {
        level: ERROR_LEVEL.FIELD,
        message: params => (params && params.outOfBoundsExpirationDateError) || getText('dateOutOfBounds')()
    },
    [ERROR_CODES.EMAIL_SUBJECT_REQUIRED]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.GIFT_CARD_NUMBER]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.GIFT_CARD_LENGTH]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.GIFT_CARD_PIN]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.GIFT_CARD_PIN_LENGTH]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.TIME]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.APPLY_FORM_SECTION]: {
        level: ERROR_LEVEL.FORM,
        message: HARDCODED
    },
    [ERROR_CODES.NOT_ENOUGH_BI_POINTS]: {
        level: ERROR_LEVEL.GLOBAL,
        label: HARDCODED
    },
    [ERROR_CODES.NOT_ENOUGH_POINTS_ERROR]: {
        level: ERROR_LEVEL.GLOBAL,
        label: HARDCODED
    },
    [ERROR_CODES.ADDRESS_IN_USE]: {
        level: ERROR_LEVEL.FORM,
        label: 'addressInUse'
    },
    [ERROR_CODES.CARD_IN_USE]: {
        level: ERROR_LEVEL.FORM,
        label: 'cardInUse'
    },
    [ERROR_CODES.INVALID_ORDER]: { level: ERROR_LEVEL.GLOBAL },
    [ERROR_CODES.INVALID_ADDRESS]: { level: ERROR_LEVEL.GLOBAL },
    [ERROR_CODES.SAME_DAY_SKU_OOS_EXCEPTION]: { level: ERROR_LEVEL.GLOBAL },
    [ERROR_CODES.MARKETING_PHONE_NUMBER]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED,
        name: 'bi registration:phone'
    },
    [ERROR_CODES.GIFT_CARD_NUMBER_REQUIRED]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.GIFT_CARD_PIN_REQUIRED]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.CREDIT_CARD_NUMBER_REQUIRED]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.CREDIT_CARD_NUMBER_INCORRECT]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.CREDIT_CARD_EXP_MONTH_REQUIRED]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.CREDIT_CARD_EXP_MONTH_INCORRECT]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.CREDIT_CARD_EXP_YEAR_REQUIRED]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.CREDIT_CARD_EXP_YEAR_INCORRECT]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.CREDIT_CARD_CVV_REQUIRED]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.CREDIT_CARD_CVV_INCORRECT]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.CREDIT_CARD_FIRST_NAME_REQUIRED]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.CREDIT_CARD_LAST_NAME_REQUIRED]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.ADDRESS_PHONE_REQUIRED]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.ADDRESS_STREET_REQUIRED]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.ADDRESS_ZIPCODE_REQUIRED]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.ADDRESS_ZIPCODE_INCORRECT]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.ADDRESS_CITY_REQUIRED]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.ADDRESS_CITY_INCORRECT]: {
        level: ERROR_LEVEL.FIELD,
        message: HARDCODED
    },
    [ERROR_CODES.CHECKOUT_GENERIC_ERROR]: {
        level: ERROR_LEVEL.GLOBAL
    }
};

// ERRORS updated with functions instead of string values of the message param
// with changed functionalylity to translate message, value, label props
Object.keys(ERRORS).forEach(errorCode => {
    const error = ERRORS[errorCode];

    if (error.message === HARDCODED) {
        error.message = getText(errorCode);
    }

    if (typeof error.label === 'string') {
        error.label = getText(error.label);
    }
});

export default {
    ERRORS,
    INLINE_ERRORS,
    INLINE_ERROR_KEYS,
    ERROR_KEYS,
    ERROR_CODES,
    ERROR_LEVEL,
    ERROR_LOCATION,
    TEXT_INPUT_MESSAGE,
    INTERSTICE_DEFAULT_TIMEOUT_MS
};
