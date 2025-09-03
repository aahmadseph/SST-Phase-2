const resources = {
    new: 'nouveautés',
    signIn: 'Ouvrir une session',
    signInToAdd: ' pour ajouter ou afficher vos préférences beauté.',
    infoModalTitle: 'Préférences beauté',
    infoModalMessage: 'Magasinez avec des filtres personnalisés selon vos ',
    infoModalMessageEndLink: 'Préférences beauté',
    gotIt: 'Compris',
    applyFilters: 'Appliquez des filtres pour définir vos préférences beauté.',
    selectAll: 'Tout sélectionner',
    deselectAll: 'Tout désélectionner'
};

export default function getResource(label) {
    return resources[label];
}
