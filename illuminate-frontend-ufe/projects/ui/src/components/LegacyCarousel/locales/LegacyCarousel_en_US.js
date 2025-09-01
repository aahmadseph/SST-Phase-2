export default function getResource(label, vars = []) {
    const resources = {
        playAnimationLabel: 'Play animation',
        pauseAnimationLabel: 'Pause animation',
        previous: 'Previous',
        next: 'Next'
    };

    return resources[label];
}
