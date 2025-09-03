export default function getResource(label, vars = []) {
    const resources = { chooseRegion: 'Choisir une région :' };

    return resources[label];
}
