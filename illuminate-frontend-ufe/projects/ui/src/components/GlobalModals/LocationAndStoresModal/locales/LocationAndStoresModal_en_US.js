export default function getResource(label) {
    const resources = {
        locationAndStores: 'Location & Stores',
        cityAndState: 'City & State of Zip',
        optional: 'Optional: Choose stores to narrow results',
        useCurrentLocation: 'Use current location',
        cancel: 'Cancel',
        showResults: 'Show results'
    };

    return resources[label];
}
