const resources = {
    tryChangeFilters: 'Try changing some of your filters to see more event results.',
    showMoreEvents: 'Show more events',
    of: 'of',
    results: 'Results',
    sortBy: 'Sort By',
    adjustFilters: 'Adjust filters',
    noEventsMessage: 'We\'re sorry we couldn\'t find any events near you. Try changing your location or store to see more event results',
    changeLocation: 'Change location'
};

export default function getResource(label) {
    return resources[label];
}
