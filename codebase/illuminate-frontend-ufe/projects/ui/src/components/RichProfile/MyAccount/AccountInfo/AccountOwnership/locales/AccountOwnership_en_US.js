export default function getResource(label) {
    const resources = {
        accountOwnership: 'Account Ownership',
        accountIsOpen: 'Your Account is currently open',
        closeAccount: 'Close Account'
    };
    return resources[label];
}
