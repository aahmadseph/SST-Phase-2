export default function getResource(label) {
    const resources = {
        noteText: 'Sauf mention contraire, toute information que vous fournissez sera intégrée à votre profil public lorsque vous soumettez un commentaire.',
        noteLabel: 'Remarque'
    };
    return resources[label];
}
