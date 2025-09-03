import FormValidator from 'utils/FormValidator';
import ErrorConstants from 'utils/ErrorConstants';
import GiftCardsBindings from 'analytics/bindingMethods/components/giftCards/giftCardsBindings';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { getLocaleResourceFile } = LanguageLocaleUtils;

const giftCardNumberLength = FormValidator.FIELD_LENGTHS.giftCardNumber;
const giftCardPinLength = FormValidator.FIELD_LENGTHS.giftCardPin;

const handleGiftCardNumberKeyDown = e => {
    // Run the default numeric input validation
    const allowed = FormValidator.inputAcceptOnlyNumbers(e);

    // If it was blocked already, no need to do more
    if (!allowed) {
        return;
    }

    const { key, target } = e;

    const { selectionStart, value } = target;

    const isBackspaceOnSpace = key.toLowerCase() === 'backspace' && selectionStart > 0 && value[selectionStart - 1] === ' ';
    const isDeleteOnSpace = key.toLowerCase() === 'delete' && value[selectionStart] === ' ';

    if (isBackspaceOnSpace || isDeleteOnSpace) {
        e.preventDefault(); // Prevent deletion of space
    }
};

const validateGiftCard = (giftCardNumber, trackEvent = false) => {
    const getText = getLocaleResourceFile('utils/locales', 'ErrorConstants');

    if (FormValidator.isEmpty(giftCardNumber)) {
        if (trackEvent) {
            GiftCardsBindings.modalError({ error: getText('gcNumber') });
        }

        return ErrorConstants.ERROR_CODES.GIFT_CARD_NUMBER;
    }

    if (!FormValidator.isValidLength(giftCardNumber, giftCardNumberLength, giftCardNumberLength)) {
        if (trackEvent) {
            GiftCardsBindings.modalError({ error: getText('gcLength') });
        }

        return ErrorConstants.ERROR_CODES.GIFT_CARD_LENGTH;
    }

    return null;
};

const validateGiftCardPin = (giftCardPin, trackEvent = false) => {
    const getText = getLocaleResourceFile('utils/locales', 'ErrorConstants');

    if (FormValidator.isEmpty(giftCardPin)) {
        if (trackEvent) {
            GiftCardsBindings.modalError({ error: getText('gcPin') });
        }

        return ErrorConstants.ERROR_CODES.GIFT_CARD_PIN;
    }

    if (!FormValidator.isNumeric(giftCardPin)) {
        if (trackEvent) {
            GiftCardsBindings.modalError({ error: getText('gcPinLength') });
        }

        return ErrorConstants.ERROR_CODES.GIFT_CARD_PIN_LENGTH;
    }

    if (!FormValidator.isValidLength(giftCardPin, giftCardPinLength, giftCardPinLength)) {
        if (trackEvent) {
            GiftCardsBindings.modalError({ error: getText('gcPinLength') });
        }

        return ErrorConstants.ERROR_CODES.GIFT_CARD_PIN_LENGTH;
    }

    return null;
};

export {
    handleGiftCardNumberKeyDown, validateGiftCard, validateGiftCardPin
};
