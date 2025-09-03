export default function getResource(label, vars = []) {
    const resources = {
        useLocation: 'Use my location',
        chooseLocation: 'Choose a location',
        updatingLocationText: 'Updating the location will automatically update the stores and time slots that are displayed.',
        cityStateZip: 'City & State or ZIP',
        clear: 'Clear',
        noStoreFound: `We were not able to find a store near “${vars[0]}”. Please try a different location.`,
        locationSharingDisabled: 'Location sharing disabled',
        locationUpdateSettings: 'To share your location, please update your browser settings.',
        ok: 'OK'
    };

    return resources[label];
}
