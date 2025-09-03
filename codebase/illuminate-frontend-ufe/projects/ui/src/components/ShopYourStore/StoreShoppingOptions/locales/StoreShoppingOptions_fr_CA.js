export default function getResource(label) {
    const resources = {
        inStorePickup: 'Ramassage en magasin',
        curbsidePickup: 'Ramassage à l’extérieur',
        beautyServices: 'Services beauté',
        storeEvents: 'Événements en magasin'
    };

    return resources[label];
}
