export default function getResource(label) {
    const resources = {
        accountClosed: 'Account Successfully Closed',
        loggedOut: 'You are now logged out.',
        message: 'If you have questions regarding closing your account please call our Customer Service team at',
        or: 'or',
        chatWithUs: 'Chat with Us'
    };
    return resources[label];
}

