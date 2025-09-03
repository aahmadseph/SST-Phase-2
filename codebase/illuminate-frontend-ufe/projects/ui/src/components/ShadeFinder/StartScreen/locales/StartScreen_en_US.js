export default function getResource(label, vars = []) {
    const resources = {
        options: 'You’ve got options!',
        start: 'Start with the foundation you currently use to find a matching shade from this brand.',
        startMultiShadeFinder: 'Start with the foundation you currently use to find matching shades from more brands.',
        getStarted: 'Let’s get started'
    };

    return resources[label];
}
