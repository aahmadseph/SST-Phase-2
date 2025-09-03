const resources = {
    findInStore: 'Find in a Sephora store',
    postal: 'Postal Code',
    zip: 'ZIP Code',
    within: 'Within',
    find: 'FIND',
    inStock: 'In Stock',
    viewMap: 'View map',
    showMore: 'Show more',
    sorry: 'We’re sorry, this item is not available within',
    selected: 's of your selected ZIP/Postal Code',
    mile: 'mile',
    kilometer: 'kilometer',
    away: 'away'
};

export default function getResource(label) {
    return resources[label];
}
