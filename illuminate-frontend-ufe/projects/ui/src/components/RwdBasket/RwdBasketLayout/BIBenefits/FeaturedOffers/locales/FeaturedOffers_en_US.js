export default function getResource(label, vars = []) {
    const resources = {
        updatedLabel: 'UPDATED',
        applyText: 'Apply',
        viewPromoCodesText: 'View featured offers',
        ccPromoLabel: 'Promo Code',
        promoLabel: 'Promo code',
        gotIt: 'Got it',
        youCanAddPromos: 'Certain promos are not eligible for pickup orders. You may add rewards in store, if available.',
        viewFeaturedOffers: 'View featured offers',
        collapsePromoField: 'Add promo or reward code',
        enterPromoCode: 'Enter promo code'
    };

    return resources[label];
}
