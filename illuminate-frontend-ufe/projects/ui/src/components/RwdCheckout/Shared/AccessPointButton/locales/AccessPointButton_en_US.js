export default function getResource(label, vars = []) {
    const resources = {
        shipToFedex: 'Ship to FedEx Pickup Location',
        shipToPickupLocation: 'Ship to a Pickup Location',
        selectLocationNearYou: 'Select a location near you',
        orShipToFedexLocation: 'Or ship to a FedEx Pickup Location near you',
        orShipToLocation: 'Or ship to a pickup location',
        accessPointInfoTitle: 'Shipping to a FedEx Pickup Location',
        changeAlternateLocation: 'Change alternate pickup location',
        moreInfoShipToFedex: 'More info about FedEx Pickup Location',
        moreInfoShipToPickupLocation: 'More info about ship to a Pickup Location',
        infoModalTitleUS: 'FedEx Pickup Location Info | Sephora',
        infoModalTitleCA: 'Ship to a Pickup Location | Sephora'
    };

    return resources[label];
}
