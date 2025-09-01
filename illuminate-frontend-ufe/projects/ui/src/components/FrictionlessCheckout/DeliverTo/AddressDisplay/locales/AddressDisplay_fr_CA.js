const resources = {
    edit: 'Modifier',
    changeShippingAddress: 'Modifier l’adresse d’expédition'
};

export default function getResource(label) {
    return resources[label];
}
