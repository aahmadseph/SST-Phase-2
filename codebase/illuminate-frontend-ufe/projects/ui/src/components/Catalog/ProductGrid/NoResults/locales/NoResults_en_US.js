
export default function getResource(label, vars = []) {
    const resources = {
        noResults1: 'Sorry, there are no products that match your filter choices.',
        noResults2: 'Try changing some of your filters to see product results.',
        noSDDResult: `Same-Day Delivery is not available for ${vars[0]}.`,
        noSDDResult2: 'Try checking other locations for availability.',
        SDDUnavailable: 'Same-Day Delivery is temporarily unavailable.',
        SDDUnavailable2: 'Please try again later.'
    };
    return resources[label];
}
