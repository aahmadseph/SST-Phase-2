export default function getResource(label) {
    const resources = {
        emailLabel: 'Adresse de courriel',
        nameLabel: 'Nom',
        editLink: 'Modifier'
    };

    return resources[label];
}
