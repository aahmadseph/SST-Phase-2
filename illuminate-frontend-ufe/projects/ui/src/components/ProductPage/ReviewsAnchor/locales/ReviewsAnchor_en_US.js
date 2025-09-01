export default function getResource(label, vars = []) {
    const resources = {
        reviewsLabel: `${vars[0]}`,
        writeReview: 'Write a review'
    };
    return resources[label];
}
