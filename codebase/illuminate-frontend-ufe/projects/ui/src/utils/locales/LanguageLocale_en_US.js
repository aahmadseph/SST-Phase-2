export default function getResource(label, vars = []) {
    const resources = {
        valueLabel: 'VALUE',
        valueLabelLower: 'value'
    };

    return resources[label];
}
