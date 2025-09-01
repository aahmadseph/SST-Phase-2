export default function getResource(label) {
    const resources = {
        benefitsFor: 'Benefits for',
        sameDayUnlimited: 'Same-Day Unlimited',
        unavailable: 'subscribers are temporarily unavailable.',
        workingToResolve: 'We’re working to resolve the issue.'
    };

    return resources[label];
}
