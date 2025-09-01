export default function getResource(label, vars = []) {
    const resources = { selectBrand: 'Sélectionnez votre marque de fond de teint actuelle' };

    return resources[label];
}
