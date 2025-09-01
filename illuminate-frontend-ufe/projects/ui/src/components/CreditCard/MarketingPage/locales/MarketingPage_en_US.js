export default function getResource(label, vars = []) {
    const resources = {
        usOnly: 'Sorry, this page is only available within the US.',
        continue: 'Continue Shopping'
    };

    return resources[label];
}
