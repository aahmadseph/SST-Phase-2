
const resources = {
    holdAtLocation: 'Ou expédier à un lieu de ramassage FedEx',
    holdAtLocationCA: 'Ou expédier à un lieu de ramassage Poste Canada',
    changeAlternatePickup: 'Changer l’autre lieu de ramassage',
    changeAlternateCA: 'Changer autre emplacement',
    shipToFedex: 'Expédition à un lieu de ramassage FedEx',
    shipToPostPickup: 'Expédition à un lieu de ramassage Poste Canada',
    selectLocationNearYou: 'Sélectionner un emplacement près de chez vous',
    infoModalTitleUS: 'Informations sur le lieu de ramassage FedEx | Sephora',
    infoModalTitleCA: 'Expédition à un lieu de ramassage | Sephora',
    moreInfoShipToFedex: 'Plus d’informations sur le lieu de ramassage FedEx',
    moreInfoShipToPickupLocation: 'Plus d’informations sur l’expédition à un lieu de ramassage'
};

export default function getResource(label) {
    return resources[label];
}
