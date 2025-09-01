export default function getResource(label, vars = []) {
    const resources = {
        shopSdd: 'Profiter de la livraison le jour même',
        notAvailableForZipCode: `Non disponible pour *${vars[0]}*.`,
        checkAnotherLocation: 'Sélectionner un autre emplacement'
    };

    return resources[label];
}
