export default function getResource(label, vars = []) {
    const resources = {
        promoWarning: 'Promo/Reward Code Warning',
        promoConfirmationTitle: 'Promotion Redeemed',
        promoConfirmationMessage: 'Your promotion has been added to your basket.',
        ok: 'OK',
        promoErrorTitle: 'Promo Error',
        promoOopsTitle: 'Oops!',
        gotIt: 'Got It'
    };

    return resources[label];
}
