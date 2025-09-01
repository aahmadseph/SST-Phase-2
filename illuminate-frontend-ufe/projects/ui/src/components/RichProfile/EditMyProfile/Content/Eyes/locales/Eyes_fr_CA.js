export default function getResource(label, vars = []) {
    const resources = {
        eyeColor: 'Couleur des yeux',
        selectOne: 'sélectionner une option'
    };

    return resources[label];
}
