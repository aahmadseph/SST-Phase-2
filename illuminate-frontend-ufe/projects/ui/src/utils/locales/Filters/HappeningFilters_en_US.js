const resources = {
    date: 'Date',
    next2Month: 'Next 2 months +',
    nextMonth: 'Next month',
    next2Weeks: 'Next 2 weeks',
    next7Days: 'Next 7 days',
    sort: 'Sort',
    closestDistance: 'Closest Distance',
    soonestDate: 'Soonest Date',
    locationAndStores: 'Location & Stores',
    category: 'Category'
};

export default function getResource(label) {
    return resources[label];
}
