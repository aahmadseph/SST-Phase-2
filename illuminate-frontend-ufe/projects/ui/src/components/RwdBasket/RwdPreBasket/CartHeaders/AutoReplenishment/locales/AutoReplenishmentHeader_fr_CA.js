export default function getResource(label, vars = []) {
    const resources = {
        autoReplenish: 'Réapprovisionnement automatique',
        freeStandardShipping: 'Livraison standard gratuite avec le réapprovisionnement automatique.'
    };
    return resources[label];
}
