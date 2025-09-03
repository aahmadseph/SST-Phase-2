export default function getResource(label, vars = []) {
    const resources = {
        reviewsLabel: `${vars[0]}`,
        writeReview: 'Rédiger un commentaire'
    };
    return resources[label];
}
