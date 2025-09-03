export default function getResource(label, vars = []) {
    const resources = {
        title: 'Beauty Insider Benefits',
        biPoints: `You currently have <b>${vars[0]} points</b>`,
        enterPromoCode: 'Enter promo code',
        rougeBadge: 'ROUGE EXCLUSIVE'
    };

    return resources[label];
}
