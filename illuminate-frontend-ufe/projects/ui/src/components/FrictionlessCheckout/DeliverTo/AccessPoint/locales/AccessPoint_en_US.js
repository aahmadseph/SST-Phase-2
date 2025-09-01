
const resources = {
    holdAtLocation: 'Or Ship to a FedEx Pickup Location',
    holdAtLocationCA: 'Or Ship to Canada Post Pickup Point',
    changeAlternatePickup: 'Change alternate pickup location',
    changeAlternateCA: 'Change alternate location',
    shipToFedex: 'Ship to FedEx Pickup Location',
    shipToPostPickup: 'Ship to Canada Post Pickup Point',
    selectLocationNearYou: 'Select a location near you',
    infoModalTitleUS: 'FedEx Pickup Location Info | Sephora',
    infoModalTitleCA: 'Ship to a Pickup Location | Sephora',
    moreInfoShipToFedex: 'More info about FedEx Pickup Location',
    moreInfoShipToPickupLocation: 'More info about ship to a Pickup Location'
};

export default function getResource(label) {
    return resources[label];
}
