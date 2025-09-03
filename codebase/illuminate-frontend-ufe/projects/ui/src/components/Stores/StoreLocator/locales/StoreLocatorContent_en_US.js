export default function getResource(label, vars = []) {
    const resources = {
        closed: 'Closed',
        findASephora: 'Find a Sephora',
        showMoreLocations: 'Show more locations',
        happeningAtSephora: 'Happening at Sephora',
        freeServicesAtStore: 'Free services, brand launches, classes & more—see what’s going on at your store today.',
        seeWhatsHappening: 'See What’s Happening',
        map: 'Map',
        list: 'List',
        noStoreNear: `We were not able to find a store near “${vars[0]}”.`,
        pleaseTryDifferentLocation: 'Please try a different location.',
        seeCompleteStoreList: 'See complete store list',
        sephora: 'Sephora',
        openUntil: 'Open until',
        storeDetails: 'Store details',
        happeningAtRedesign: 'Services and Events at Sephora',
        seeWhatsGoingOnRedesign: 'Explore our beauty services and free events at your store today.',
        seeWhatsHappeningRedesign: 'Explore Services and Events'

    };
    return resources[label];
}
