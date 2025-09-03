export default function getResource(label, vars = []) {
    const resources = {
        pausePlayAnimationLabel: `${vars[0] ? 'Stop': 'Play'} animation`,
        previous: 'Previous',
        next: 'Next',
        slide: 'slide'
    };

    return resources[label];
}
