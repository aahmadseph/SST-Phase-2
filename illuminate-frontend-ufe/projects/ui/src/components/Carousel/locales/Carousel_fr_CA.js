export default function getResource(label, vars = []) {
    const resources = {
        pausePlayAnimationLabel: `${vars[0] ? 'Arrêter la ': 'lecture de '}l’animation`,
        previous: 'Précédent',
        next: 'Suivant',
        slide: 'diapo'
    };

    return resources[label];
}
