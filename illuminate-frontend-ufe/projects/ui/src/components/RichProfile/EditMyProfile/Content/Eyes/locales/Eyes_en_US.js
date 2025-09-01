export default function getResource(label, vars = []) {
    const resources = {
        eyeColor: 'Eye color',
        selectOne: 'select one'
    };

    return resources[label];
}
