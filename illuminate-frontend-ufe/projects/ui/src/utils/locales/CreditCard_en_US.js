export default function getResource(label, vars = []) {
    const resources = {
        sephoraCard: 'Sephora Card',
        sephoraTempCard: 'Sephora Temp Card',
        sephoraVisaCard: 'Sephora VISA Card',
        sephoraVisaTempCard: 'Sephora VISA Temp Card',
        creditCardEncryptionErrorMessage: 'We\'re experiencing a connection issue with this payment method. Please try again later or use a different payment method.'
    };

    return resources[label];
}
