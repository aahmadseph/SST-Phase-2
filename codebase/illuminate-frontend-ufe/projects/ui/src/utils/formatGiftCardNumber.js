// Utility to format a card number as '1234 5678 9012 3456'
export default function formatGiftCardNumber(cardNumber) {
    if (!cardNumber) {
        return '';
    }

    const digits = cardNumber.replace(/\D/g, '');

    return digits.replace(/(.{4})/g, '$1 ').trim();
}
