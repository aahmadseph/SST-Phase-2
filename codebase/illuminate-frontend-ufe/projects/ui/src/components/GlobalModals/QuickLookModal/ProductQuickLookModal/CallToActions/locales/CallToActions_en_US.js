export default function getResource(label, vars = []) {
    const resources = {
        viewFullSizeLabel: 'View Full Size',
        viewDetailsLabel: 'View Details',
        seeFullDetails: 'See Full Details'
    };
    return resources[label];
}
