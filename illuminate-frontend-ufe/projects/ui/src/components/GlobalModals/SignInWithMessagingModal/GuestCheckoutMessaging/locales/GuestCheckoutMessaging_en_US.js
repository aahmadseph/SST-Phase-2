export default function getResource(label, vars = []) {
    const resources = {
        guestCheckoutMessage: 'Guest Checkout',
        createAccountCheckoutMessage: 'Create an Account',
        youCanJoinMessage: 'You can join our free loyalty program after completing checkout.',
        joinBeautyInsiderMessage: 'Join the Beauty Insider loyalty program for free! It’s your ticket to savings, samples and more.',
        continueGuestButton: 'Continue As Guest',
        createAccountButton: 'Create Account',
        checkOutAsAGuestButton: 'Check Out as a Guest',
        freeBirthdayGift: 'FREE\nBirthday Gift',
        seasonalSavingsEvents: 'Seasonal\nSavings Events',
        freeShipping: 'FREE\nShipping',
        bankYourBeautyPointsFree: `Bank those *${vars[0]} points* — and enjoy great benefits, including *FREE standard shipping* — by joining Beauty Insider, our FREE loyalty program.`
    };

    return resources[label];
}
