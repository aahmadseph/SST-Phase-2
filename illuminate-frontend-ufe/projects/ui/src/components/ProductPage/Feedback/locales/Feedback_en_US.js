export default function getResource(label) {
    const resources = {
        helpful: 'Helpful?',
        thanks: 'Thanks for your feedback'
    };
    return resources[label];
}
