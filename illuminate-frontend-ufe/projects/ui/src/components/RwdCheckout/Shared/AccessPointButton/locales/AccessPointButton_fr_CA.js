export default function getResource(label, vars = []) {
    const resources = {
        shipToFedex: 'Expédition à un lieu de ramassage FedEx',
        shipToPickupLocation: 'Expédition à un lieu de ramassage',
        selectLocationNearYou: 'Sélectionner un emplacement près de chez vous',
        orShipToFedexLocation: 'Ou expédier à un lieu de ramassage FedEx près de chez vous',
        orShipToLocation: 'Ou expédier à un lieu de ramassage',
        accessPointInfoTitle: 'Expédier à un lieu de ramassage FedEx',
        changeAlternateLocation: 'Changer l’autre lieu de ramassage',
        moreInfoShipToFedex: 'Plus d’informations sur le lieu de ramassage FedEx',
        moreInfoShipToPickupLocation: 'Plus d’informations sur l’expédition à un lieu de ramassage',
        infoModalTitleUS: 'Informations sur le lieu de ramassage FedEx | Sephora',
        infoModalTitleCA: 'Expédition à un lieu de ramassage | Sephora'
    };

    return resources[label];
}
