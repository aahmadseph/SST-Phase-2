export default function getResource(label) {
    const resources = {
        your: 'Your ',
        colorIQMatch: 'Color iQ match.',
        colorIQ: 'See your Color iQ match'
    };
    return resources[label];
}
