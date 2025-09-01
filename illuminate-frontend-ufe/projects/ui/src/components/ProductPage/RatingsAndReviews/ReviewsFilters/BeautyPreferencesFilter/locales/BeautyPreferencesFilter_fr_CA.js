export default function getResource(label, vars = []) {
    const resources = {
        beautyPreferences: 'Vos préférences beauté',
        modalTitle: 'Préférences beauté',
        modalBody: 'Vous n’avez enregistré aucune préférence beauté pour cette catégorie. Utilisez les autres filtres pour trouver les évaluations pertinentes.',
        buttonText: 'Compris'
    };
    return resources[label];
}
