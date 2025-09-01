export default function getResource(label, vars = []) {
    const resources = {
        playAnimationLabel: 'Faire jouer l’animation',
        pauseAnimationLabel: 'Interrompre l’animation',
        previous: 'Précédent',
        next: 'Suivant'
    };

    return resources[label];
}
