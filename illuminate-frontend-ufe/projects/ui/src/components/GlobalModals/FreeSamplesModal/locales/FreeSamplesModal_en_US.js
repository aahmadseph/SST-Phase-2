export default function getResource(label, vars = []) {
    const resources = {
        title: `Add Up to ${vars[0]} Free Samples`,
        done: 'Done',
        note: 'Note',
        footerNote: 'Samples are subject to stock availability.',
        addToBasketShort: 'Add',
        signInToAccess: 'Sign in to access',
        remove: 'Remove'
    };

    return resources[label];
}
