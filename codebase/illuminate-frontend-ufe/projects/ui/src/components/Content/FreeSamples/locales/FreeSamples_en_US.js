export default function getResource(label, vars = []) {
    const resources = {
        title: 'Pick Your Free Samples',
        youCanSelect: 'You can select up to 2 samples per order.',
        countMessage: `${vars[0]} of 2 sample(s) added`
    };

    return resources[label];
}
