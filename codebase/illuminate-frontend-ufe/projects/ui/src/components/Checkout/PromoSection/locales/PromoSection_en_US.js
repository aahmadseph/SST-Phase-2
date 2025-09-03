export default function getResource(label, vars = []) {
    const resources = {
        updatedLabel: 'UPDATED',
        applyText: 'Apply',
        appliedText: 'Applied',
        removeText: 'Remove',
        viewPromoCodesText: 'View featured offers',
        ccPromoLabel: 'Promo or Reward Code',
        promoLabel: 'Promo code',
        gotIt: 'Got it',
        youCanAddPromos: 'Certain promos are not eligible for pickup orders. You may add rewards in store, if available.'
    };

    return resources[label];
}
