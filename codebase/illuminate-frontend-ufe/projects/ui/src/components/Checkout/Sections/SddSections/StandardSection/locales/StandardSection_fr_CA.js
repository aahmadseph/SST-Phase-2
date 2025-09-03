export default function getResource(label, vars) {
    const resources = {
        editLinkText: 'Modifier',
        subTitle: 'Expédition standard – GRATUITE',
        title: 'Livraison',
        autoReplenTitle: 'Livraison'
    };

    return resources[label];
}
