export default function getResource(label, vars = []) {
    const resources = {
        appExclusive: 'App Exclusive',
        limitedTimeOffer: 'Limited Time Offer',
        comingSoon: 'Coming Soon',
        firstAccess: 'First Access',
        limitedEdition: 'Limited Edition',
        onlyAtSephora: 'Only at Sephora',
        onlineOnly: 'Online Only',
        outOfStock: 'Out of Stock',
        salePrice: 'Sale',
        new: 'New',
        onlyFewLeft: 'Only a few left',
        match: 'match'
    };
    return resources[label];
}
