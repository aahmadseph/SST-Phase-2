export default function getResource(label, vars = []) {
    const resources = {
        please: 'Please',
        toReviewSection: 'to review this section.',
        signIn: 'sign in'
    };

    return resources[label];
}
