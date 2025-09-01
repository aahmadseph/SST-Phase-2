import { SEPHORA_CARD_TYPES } from 'constants/CreditCard';
import localeUtils from 'utils/LanguageLocale';
import orderUtils from 'utils/Order';
import creditCardType from 'credit-card-type';
import javascript from 'utils/javascript';
import FormValidator from 'utils/FormValidator';

const getText = localeUtils.getLocaleResourceFile('utils/locales', 'CreditCard');
const cardsAccepted = javascript.getObjectValuesSlowNDirty(orderUtils.PAYMENT_TYPE.CREDIT_CARD);

let CHASE_SCRIPTS_REQUESTED = false;

function isAMEXCard(rawCardType = '') {
    const AMEX_TYPE = orderUtils.PAYMENT_TYPE.CREDIT_CARD.americanExpress;
    const cardType = rawCardType.indexOf(' ') > 0 ? rawCardType.replace(' ', '-').toLowerCase() : rawCardType;

    return cardType === AMEX_TYPE || orderUtils.PAYMENT_TYPE.CREDIT_CARD[cardType] === AMEX_TYPE;
}

const getSecurityCodeLength = function (cardType) {
    return isAMEXCard(cardType) ? FormValidator.FIELD_LENGTHS.securityCodeAmex : FormValidator.FIELD_LENGTHS.securityCode;
};

function formatExpMonth(month) {
    return `0${month}`;
}

function formatExpYear(year) {
    return '' + (parseInt(year) - 2000);
}

function formatCardNumber(cardNumber = '') {
    return cardNumber.match(/.{1,4}/g)?.join(' ') || '';
}

function cleanCreditCardData(creditCardData) {
    const newCreditCard = Object.assign({}, creditCardData);

    //need to remove all these propertys or else we get api error
    //when we try to update the credit card for checkout
    delete newCreditCard.isDefault;
    delete newCreditCard.cardNumber;
    delete newCreditCard.isExpired;
    delete newCreditCard.isPreApproved;
    delete newCreditCard.isCardInOrder;
    delete newCreditCard.paymentDisplayInfo;
    delete newCreditCard.amount;
    delete newCreditCard.isComplete;
    delete newCreditCard.paymentGroupId;

    return newCreditCard;
}

// @TODO may be rewritten just as return value of all checks
function isShipAddressBillingAddress(shipAddress, billingAddress) {
    // have to compare all properties of shipaddress and billing address
    // to determine if they are in fact the same
    // if they are the same, return true, if not return false
    if (!shipAddress) {
        return false;
    } else if (shipAddress.address1 !== billingAddress.address1) {
        return false;
    } else if (shipAddress.address2 && shipAddress.address2 !== billingAddress.address2) {
        return false;
    } else if (shipAddress.city !== billingAddress.city) {
        return false;
    } else if (shipAddress.country !== billingAddress.country) {
        return false;
    } else if (shipAddress.phone !== billingAddress.phone) {
        return false;
    } else if (shipAddress.postalCode !== billingAddress.postalCode) {
        return false;
    } else if (shipAddress.state !== billingAddress.state) {
        return false;
    } else {
        return true;
    }
}

function shortenCardNumber(cardNumber = '') {
    return cardNumber.substring(cardNumber.length - 4);
}

function isSavedToProfile(creditCardId = '') {
    if (creditCardId && typeof creditCardId === 'string') {
        return true;
    } else {
        return false;
    }
}

// @TODO the module should be rewritten in order to allow stubbing its' methods
// as a class or an object
// revealing module pattern is not the best solution for testability
function numberOfSavedCards(creditCards) {
    let count = 0;

    if (creditCards) {
        for (let i = 0; i < creditCards.length; i++) {
            isSavedToProfile(creditCards[i].creditCardId) && count++;
        }
    }

    return count;
}

function getCardName(cardType) {
    const cardNames = {
        [SEPHORA_CARD_TYPES.PRIVATE_LABEL]: getText('sephoraCard'),
        [SEPHORA_CARD_TYPES.PRIVATE_LABEL_TEMP]: getText('sephoraTempCard'),
        [SEPHORA_CARD_TYPES.CO_BRANDED]: getText('sephoraVisaCard'),
        [SEPHORA_CARD_TYPES.CO_BRANDED_TEMP]: getText('sephoraVisaTempCard')
    };

    return cardNames[cardType] || cardType;
}

function isValidRowCCType(cardType) {
    return (
        cardType === SEPHORA_CARD_TYPES.CO_BRANDED ||
        cardType === SEPHORA_CARD_TYPES.CO_BRANDED_TEMP ||
        cardType === orderUtils.CREDIT_CARD_TYPES.VISA.name ||
        cardType === orderUtils.CREDIT_CARD_TYPES.MASTERCARD.name ||
        cardType === orderUtils.CREDIT_CARD_TYPES.AMERICAN_EXPRESS.name
    );
}

function removeTokenizerUrls(creditCardData) {
    const {
        creditCard: { tokenizerUrls }
    } = creditCardData;
    tokenizerUrls && delete creditCardData.creditCard.tokenizerUrls;

    return creditCardData;
}

function doEncryption(creditCard) {
    const ccno = creditCard.cardNumber;
    const cvv = creditCard.securityCode || '000';
    const embed = true;
    const result = 'ProtectPANandCVV' in window && window.ProtectPANandCVV(ccno, cvv, embed);

    if (result && result.length > 2) {
        return result;
    } else {
        return null;
    }
}

function createScript(source) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = source;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
}

function loadChaseTokenizerWithRetry(filePath) {
    const host1 = `https://${Sephora.configurationSettings?.paymentConfiguration?.chaseSdkFrontEndServer}`;
    const host2 = `https://${Sephora.configurationSettings?.paymentConfiguration?.chaseSecondarySdkFrontEndServer}`;
    createScript(`${host1}${filePath}`).catch(() =>
        // eslint-disable-next-line no-console
        createScript(`${host2}${filePath}`).catch(() => console.error(`Encription.FailedToLoad ${filePath}`))
    );
}

function loadChaseTokenizer() {
    if (CHASE_SCRIPTS_REQUESTED) {
        return;
    }

    CHASE_SCRIPTS_REQUESTED = true;

    const encryptionFilePath = '/pie/v1/encryption.js';
    loadChaseTokenizerWithRetry(encryptionFilePath);

    const getkeyFilePath = `/pie/v1/${Sephora.configurationSettings?.paymentConfiguration?.chaseSdkMID}/getkey.js`;
    loadChaseTokenizerWithRetry(getkeyFilePath);
}

function throwCreditCardEncryptionError() {
    const errorData = {
        errorCode: -1,
        errorFields: ['creditCard.failedEncryption'],
        errorMessages: [getText('creditCardEncryptionErrorMessage')],
        errors: {
            failedEncryption: [getText('creditCardEncryptionErrorMessage')]
        },
        key: 'creditCard.failedEncryption',
        responseStatus: 200
    };

    return errorData;
}

function getEncryptedCreditCardData(creditCardData) {
    const sanitizedCreditCardData = removeTokenizerUrls(creditCardData);

    if (Sephora.configurationSettings.isChasePaymentEnabled) {
        try {
            const encryptedCreditCard = doEncryption(creditCardData.creditCard);

            if (encryptedCreditCard && encryptedCreditCard.length > 0) {
                sanitizedCreditCardData.creditCard.encryptedCCNumber = encryptedCreditCard[0];
                sanitizedCreditCardData.creditCard.encryptedCVV = encryptedCreditCard[1];
                sanitizedCreditCardData.creditCard['paymentRefData'] = {
                    integrityCheck: encryptedCreditCard[2],
                    phase: window.PIE.phase,
                    keyID: window.PIE.key_id
                };
            } else {
                console.error('Encription.Failed'); // eslint-disable-line no-console

                return throwCreditCardEncryptionError();
            }
        } catch (err) {
            console.error('Encription.Failed', err); // eslint-disable-line no-console

            return throwCreditCardEncryptionError();
        }
    }

    if (!Sephora.configurationSettings.isCybersourceEnabled) {
        delete sanitizedCreditCardData.creditCard.cardNumber;
    }

    return sanitizedCreditCardData;
}

const getCardType = cardNumber => {
    let cardTypes = [];
    // First, try detecting if is a Sephora Card
    const sephoraCardType = orderUtils.detectSephoraCard(cardNumber);

    if (sephoraCardType) {
        cardTypes = cardTypes.concat(sephoraCardType);
    } else {
        // If not a Sephora Card, try detecting the Card Network
        cardTypes = cardTypes
            .concat(creditCardType(cardNumber).map(cardInfo => cardInfo.type))
            .filter(cardType => cardsAccepted.indexOf(cardType) >= 0);
        cardTypes = cardTypes.map(cardType => javascript.getKeyByValue(orderUtils.PAYMENT_TYPE.CREDIT_CARD, cardType));
    }

    return cardTypes[0];
};

const isCreditCardReady = ({ isPaymentReady, selectedCreditCard }) => {
    if ((isPaymentReady && selectedCreditCard?.selectedForPayment) || selectedCreditCard?.isPreApproved || selectedCreditCard?.securityCode) {
        return true;
    }

    return false;
};

/**
 * Function checks if Token Migration process **Succeed** for a given credit card.
 * Returns True only when migration **Succeed**, returs false if **Failed** or functionality is **Disabled**
 * @param {*} creditCard card to check
 * @returns {Boolean}
 */
const tokenMigrationSucceed = creditCard => {
    return creditCard?.isMigrated === true;
};

/**
 * Function checks if Token Migration process **Failed** for a given credit card.
 * Returns True only when migration **Failed**, returs false if **Succeed** or functionality is **Disabled**
 * @param {*} creditCard card to check
 * @returns {Boolean}
 */
const tokenMigrationFailed = creditCard => {
    return creditCard?.isMigrated === false;
};

/**
 * Function checks if Token Migration functionality is **Enabled** for a given credit card.
 * Returns True only when the functionality is **Enabled**
 * @param {*} creditCard card to check
 * @returns {Boolean}
 */
const tokenMigrationEnabled = creditCard => {
    return tokenMigrationSucceed(creditCard) || tokenMigrationFailed(creditCard);
};

/**
 * Function checks if Token Migration functionality is **Disabled** or Token Migration process **Succeed** for a given credit card.
 * @param {*} creditCard card to be checked
 * @returns {Boolean}
 */
const tokenMigrationDisabledOrSucceed = creditCard => {
    return !tokenMigrationEnabled(creditCard) || tokenMigrationSucceed(creditCard);
};

/**
 * Function checks if ExpiredMessage for a given creditCard should be shown
 * @param {*} creditCard
 * @returns {Boolean}
 */
const showExpiredMessage = creditCard => {
    return creditCard.isExpired && tokenMigrationDisabledOrSucceed(creditCard);
};

const creditCardLogos = new Map([
    ['Sephora Card', 'sephora'],
    ['VISA', 'visa'],
    ['MasterCard', 'masterCard'],
    ['American Express', 'americanExpress'],
    ['Discover', 'discover']
]);

export default {
    getSecurityCodeLength,
    cleanCreditCardData,
    creditCardLogos,
    formatExpMonth,
    formatExpYear,
    formatCardNumber,
    getCardName,
    getCardType,
    isSavedToProfile,
    isShipAddressBillingAddress,
    isValidRowCCType,
    numberOfSavedCards,
    removeTokenizerUrls,
    shortenCardNumber,
    isCreditCardReady,
    doEncryption,
    getEncryptedCreditCardData,
    loadChaseTokenizer,
    tokenMigrationSucceed,
    tokenMigrationFailed,
    tokenMigrationEnabled,
    tokenMigrationDisabledOrSucceed,
    showExpiredMessage,
    isAMEXCard
};
