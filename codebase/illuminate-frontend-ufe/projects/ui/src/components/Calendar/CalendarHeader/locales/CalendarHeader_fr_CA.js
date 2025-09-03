
export default function getResource(label, vars = []) {
    const resources = {
        selectDay: 'Veuillez sélectionner un jour',
        prev: 'Précédent',
        next: 'Suivant'
    };
    return resources[label];
}
