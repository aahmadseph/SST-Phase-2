export default function getResource(label) {
    const resources = {
        aboutYou: 'About You',
        optionalInformation: 'This optional information helps make your review more useful to other shoppers.',
        postReview: 'Post Review'
    };
    return resources[label];
}
