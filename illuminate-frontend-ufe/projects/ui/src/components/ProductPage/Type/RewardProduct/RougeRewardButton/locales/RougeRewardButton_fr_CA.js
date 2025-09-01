export default function getResource(label, vars = []) {
    const resources = {
        checkboxContentDefaultText: 'J’accepte les',
        checkboxContentDefaultLink: 'Conditions'
    };
    return resources[label];
}
