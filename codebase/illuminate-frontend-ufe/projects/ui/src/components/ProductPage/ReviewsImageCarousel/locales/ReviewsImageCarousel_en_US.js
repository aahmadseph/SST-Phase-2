export default function getResource(label, vars = []) {
    const resources = {
        title: 'Images from reviews',
        showReview: 'Show review'
    };
    return resources[label];
}
