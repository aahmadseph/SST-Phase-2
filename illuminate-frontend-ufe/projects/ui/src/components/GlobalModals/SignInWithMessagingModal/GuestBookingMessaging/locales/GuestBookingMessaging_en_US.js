export default function getResource(label, vars = []) {
    const resources = {
        createAccountButton: 'Create Account',
        bookingAsAGuestButton: 'Continue as a Guest',
        freeBirthdayGift: 'FREE\nBirthday Gift',
        seasonalSavingsEvents: 'Seasonal\nSavings Events',
        freeShipping: 'FREE\nShipping',
        bankYourBeautyPointsFree: `Bank those *${vars[0]} points* after service completion -- and enjoy great benefits, including *FREE standard shipping* -- by joining Beauty Insider, our FREE loyalty program.`,
        createAccountBookingMessage: 'Create an Account'
    };

    return resources[label];
}
