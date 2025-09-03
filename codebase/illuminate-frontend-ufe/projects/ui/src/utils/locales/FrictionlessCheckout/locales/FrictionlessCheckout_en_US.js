export default function getResource(label, vars = []) {
    const resources = {
        defaultMessage: 'Something went wrong here. Please review your information and try again.',
        creditCardMigratedError: 'Please edit payments.',
        cardMissingDetailsDefault: 'There may be errors with your selection, please check again.',
        contactCS: `Account verification is required to complete purchase. Please Chat with or call Customer Service at ${vars[0]}.`,
        csPhone: '1-877-SEPHORA (1-877-737-4672)',
        csHours: 'Customer Service is available:',
        monToFri: 'MON-FRI',
        monFriHours: `${vars[0]}: 5am - 9pm PT`,
        satToSun: 'SAT-SUN',
        satSunHours: `${vars[0]}: 6am - 9pm PT`,
        ok: 'OK',
        chat: 'Chat',
        error: 'Error',
        adjustBasket: 'Adjust Basket',
        verificationRequired: 'Verification Required',
        guestErrorMessage: 'We are unable to process your online order at this time. We invite you to shop in our Sephora stores.',
        defaultErrorMessage: 'We\'re sorry, something went wrong. Please check your internet connection and try again.',
        BIUnavailable: 'Beauty Insider is temporarily unavailable. Please check back later.',
        confirmCVV: 'Please confirm your CVV to place your order'
    };

    return resources[label];
}
