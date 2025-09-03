const resources = {
    showMore: 'Show More Products',
    breadcrumb: 'Breadcrumb',
    viewing: 'Viewing',
    results: 'results'
};

export default function getResource(label) {
    return resources[label];
}
