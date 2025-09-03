export default function getResource(label) {
    const resources = {
        gotIt: 'Got It',
        curbsideConcierge: 'Curbside Concierge',
        whatItIs: 'What It Is',
        whatToDo: 'What To Do',
        curbsideConciergeAltText: 'Curbside Concierge Icon',
        inStorePickupAltText: 'In Store Pickup Icon'
    };

    return resources[label];
}
