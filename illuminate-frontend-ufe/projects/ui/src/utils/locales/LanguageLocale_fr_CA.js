export default function getResource(label, vars = []) {
    const resources = {
        valueLabel: 'VALEUR',
        valueLabelLower: 'valeur'
    };

    return resources[label];
}
