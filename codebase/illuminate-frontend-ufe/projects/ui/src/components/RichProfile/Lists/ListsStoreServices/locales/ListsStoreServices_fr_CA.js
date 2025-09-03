export default function getResource(label, vars = []) {
    const resources = {
        inStoreServices: 'Services en magasin',
        makeoverAt: '- Séance maquillage chez',
        findStore: 'Trouver en magasin'
    };
    return resources[label];
}
