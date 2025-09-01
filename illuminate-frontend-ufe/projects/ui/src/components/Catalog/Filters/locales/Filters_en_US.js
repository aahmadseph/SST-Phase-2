const resources = {
    filters: 'Filters',
    modalTitle: 'Filter & Sort',
    clear: 'Clear',
    clearAll: 'Clear all',
    showResults: 'Show Results',
    showMore: 'Show more',
    apply: 'Apply',
    search: 'Search',
    noResults: 'No results',
    viewAZ: 'View A-Z',
    viewByRelevance: 'View by Relevance',
    chooseStore: 'Choose a Store',
    setYourLocation: 'Set Your Location',
    pickUp: 'Pickup',
    sameDayDelivery: 'Same-Day Delivery',
    pickupAndDelivery: 'Pickup & Delivery',
    clearSearch: 'Clear Search',
    jumpTo: 'Jump to...'
};

export default function getResource(label) {
    return resources[label];
}
