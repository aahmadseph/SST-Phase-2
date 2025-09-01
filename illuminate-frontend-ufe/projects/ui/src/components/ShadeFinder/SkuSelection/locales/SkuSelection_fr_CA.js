export default function getResource(label, vars = []) {
    const resources = { selectCurrent: 'Choisissez votre teinte actuelle pour' };

    return resources[label];
}
