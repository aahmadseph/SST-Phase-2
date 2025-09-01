const resources = {
    title: 'Directives pour la livraison le jour même',
    optional: '(facultatif)',
    cancel: 'Annuler',
    saveInstructions: 'Enregistrer les directives',
    edit: 'Modifier',
    textInputLabel: 'Exemple : Veuillez entrer le code de la porte à votre arrivée.',
    deliveryNote: 'Nous laisserons vos articles à votre porte si vous n’êtes pas là au moment de la livraison.'
};

export default function getResource(label) {
    return resources[label];
}
