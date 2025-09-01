const resources = {
    getDirections: 'Obtenir un itinéraire',
    callStore: 'Appeler le magasin',
    makeMyStore: 'En faire Mon magasin sélectionné',
    yourSelectedStore: 'Votre magasin sélectionné'
};

export default function getResource(label) {
    return resources[label];
}
