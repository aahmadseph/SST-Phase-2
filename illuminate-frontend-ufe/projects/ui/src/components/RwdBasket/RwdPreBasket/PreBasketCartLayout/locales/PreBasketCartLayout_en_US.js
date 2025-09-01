export default function getResource(label, vars=[]) {
    const resources = {
        seeAll: 'See all',
        xItems: `${vars[0]} items`,
        checkout: 'View Items & Checkout'
    };

    return resources[label];
}
