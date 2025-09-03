export default function getResource(label, vars = []) {
    const resources = {
        ifYouOrderWithin: `If you ${vars[0]}`,
        free: 'FREE',
        warning: 'Warning',
        shippingMethodError: `Unfortunately, we can only ship to your address using ${vars[0]}. Please select this method or choose a different address on the Apple Pay sheet.`,
        error: 'Error',
        adjustBasket: 'Adjust Basket',
        verificationRequired: 'Verification Required',
        contactCS: `Account verification is required to complete purchase. Please Chat with or call Customer Service at ${vars[0]}.`,
        csPhone: '1-877-SEPHORA (1-877-737-4672)',
        csHours: 'Customer Service is available:',
        monToFri: 'MON-FRI',
        monFriHours: `${vars[0]}: 5am - 9pm PT`,
        satToSun: 'SAT-SUN',
        satSunHours: `${vars[0]}: 6am - 9pm PT`,
        ok: 'OK',
        chat: 'Chat',
        guestErrorMessage: 'We are unable to process your online order at this time. We invite you to shop in our Sephora stores.'
    };

    return resources[label];
}
