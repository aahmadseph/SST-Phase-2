const resources = {
    sortBy: 'Sort by',
    sortDescribedBy: 'Choosing sorting option will automatically update the products that are displayed to match the selected sorting option'
};

export default function getResource(label) {
    return resources[label];
}
