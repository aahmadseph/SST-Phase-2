export default function getResource(label, vars = []) {
    const resources = {
        inStoreServices: 'In-store Services',
        showMore: 'Show More',
        signInToSee: 'You have to sign in to see this page.',
        signIn: 'Sign In'
    };

    return resources[label];
}
