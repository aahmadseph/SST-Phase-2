export default function getResource(label, vars = []) {
    const resources = {
        storeDetails: 'Détails du magasin',
        inStore: 'Ramassage en magasin'
    };
    return resources[label];
}
