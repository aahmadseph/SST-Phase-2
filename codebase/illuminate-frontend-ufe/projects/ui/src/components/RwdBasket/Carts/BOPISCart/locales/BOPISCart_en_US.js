export default function getResource(label, vars = []) {
    const resources = {
        bopisTitle: `Buy Online and Pick Up (${vars[0]})`,
        changeMethod: 'Change Method'

    };

    return resources[label];
}
