export default function getResource(label, vars = []) {
    const resources = {
        selectShoppingExperience: 'Sélectionnez une expérience de magasinage',
        unitedStates: 'États-Unis'
    };
    return resources[label];
}
