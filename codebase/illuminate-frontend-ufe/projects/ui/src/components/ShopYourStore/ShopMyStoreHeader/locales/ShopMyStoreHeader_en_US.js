export default function getResource(label, vars=[]) {
    const resources = {
        shop: 'Shop',
        openUntil: `Open until ${vars[0]} today`,
        closed: 'Store Closed',
        storeDetails: 'Store Details',
        findAStore: 'Find a Store',
        servicesAndEvents: 'Services & Events'
    };

    return resources[label];
}
