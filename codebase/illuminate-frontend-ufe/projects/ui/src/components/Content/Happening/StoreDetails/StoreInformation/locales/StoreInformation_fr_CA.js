const resources = {
    inStoreShopping: 'Magasinage en magasin',
    inStorePickup: 'Ramassage en magasin',
    curbside: 'Ramassage à l’extérieur',
    beautyServices: 'Services beauté',
    storeEvents: 'Événements en magasin'
};

export default function getResource(label) {
    return resources[label];
}
