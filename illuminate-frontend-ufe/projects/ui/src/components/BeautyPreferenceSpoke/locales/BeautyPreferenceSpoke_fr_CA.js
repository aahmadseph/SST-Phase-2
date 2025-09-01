export default function getResource(label, vars = []) {
    const resources = {
        endDescription: 'à vos préférences beauté',
        edit: 'Modifier',
        save: 'Enregistrer',
        and: 'et',
        saved: 'Sauvegardé',
        notNow: 'Pas maintenant'
    };
    return resources[label];
}
