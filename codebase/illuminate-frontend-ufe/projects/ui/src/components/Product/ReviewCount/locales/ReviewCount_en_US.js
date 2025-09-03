export default function getResource(label) {
    const resources = { review: 'review', reviews: 'reviews' };
    return resources[label];
}
