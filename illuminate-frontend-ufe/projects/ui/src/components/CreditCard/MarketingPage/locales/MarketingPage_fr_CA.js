export default function getResource(label, vars = []) {
    const resources = {
        usOnly: 'Malheureusement, cette page est uniquement disponible aux États-Unis.',
        continue: 'Continuer à magasiner'
    };

    return resources[label];
}
