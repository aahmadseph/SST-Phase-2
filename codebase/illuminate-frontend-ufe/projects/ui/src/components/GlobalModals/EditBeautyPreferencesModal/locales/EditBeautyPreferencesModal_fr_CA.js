export default function getResource(label, vars = []) {
    const resources = {
        title: 'Enregistrer dans vos préférences beauté?',
        save: 'Enregistrer',
        cancel: 'Annuler',
        saved: 'Sauvegardé'
    };

    return resources[label];
}
