export default function getResource(label, vars = []) {
    const resources = {
        title: 'Oops, you are not signed in!',
        description: 'Please sign in to view your reservations.',
        button: 'Sign In'
    };
    return resources[label];
}
