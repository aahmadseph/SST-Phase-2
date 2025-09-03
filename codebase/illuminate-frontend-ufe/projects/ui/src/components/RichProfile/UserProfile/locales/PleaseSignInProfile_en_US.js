export default function getResource(label, vars = []) {
    const resources = {
        please: 'Please',
        signIn: 'sign in',
        toViewThisPage: 'to view this page.'
    };
    return resources[label];
}
