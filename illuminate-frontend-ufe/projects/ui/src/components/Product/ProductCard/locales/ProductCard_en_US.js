export default function getResource(label) {
    const resources = {
        free: 'FREE',
        value: 'value',
        onlyAFewLeft: 'Only a few left',
        color: 'Color',
        size: 'Size',
        type: 'Type',
        scent: 'Scent'
    };
    return resources[label];
}
