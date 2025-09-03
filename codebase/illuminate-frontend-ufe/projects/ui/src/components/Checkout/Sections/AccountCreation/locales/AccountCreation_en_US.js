export default function getResource(label) {
    const resources = {
        emailLabel: 'Email Address',
        nameLabel: 'Name',
        editLink: 'Edit'
    };

    return resources[label];
}
