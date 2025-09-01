export default function getResource(label) {
    const resources = {
        SDUAvailable: 'Same-Day Unlimited is available in ',
        SDUUnavailable: 'Unavailable in ',
        yourLocation: 'your location',
        noSephoraLocations: 'There are no Sephora locations available near you for Same-Day Delivery.',
        checkAnotherPostalCode: 'Check Another Postal Code',
        checkAnotherZIP: 'Check Another ZIP',
        tapToSeeAvailability: 'Tap to see availability for '
    };

    return resources[label];
}
