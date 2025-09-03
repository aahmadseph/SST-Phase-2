export default function getResource(label, vars = []) {
    const resources = {
        modalTitle: 'Ship to FedEx Pickup Location',
        modalTitleCA: 'Ship to a Canada Post Pickup Point',
        detailsModalTitle: 'Location Details',
        confirmButton: 'Choose This Location',
        fedexOnsite: 'FedEx OnSite',
        getDirections: 'Get directions',
        loactionHours: 'Location Hours',
        monToFri: 'Mon - Fri',
        monToSat: 'Mon - Sat',
        daysRangeSeparator: '-',
        monday: 'Mon',
        tuesday: 'Tue',
        wednesday: 'Wed',
        thursday: 'Thu',
        friday: 'Fri',
        saturday: 'Sat',
        sunday: 'Sun',
        AM: 'AM',
        PM: 'PM',
        miles: 'miles',
        kilometers: 'kilometers',
        away: 'away',
        openUntil: 'Open until',
        noStoresFound: `We were not able to find a location near “${vars[0]}”. Please try a different location.`,
        enterSearchParams: `In order to display ${vars[0]} near you, please provide your city & state or zip code or click the "Use my location" button.`,
        unableToFindResults: `We are unable to find results for ${vars[0]} at this time.`,
        pleaseTryAgain: 'Please try again in a moment or switch to another delivery method.',
        noLocationHours: 'No location hours',
        fedexLocations: 'FedEx Locations',
        canadaPostLocations: 'Canada Post Pickup Locations'
    };

    return resources[label];
}
