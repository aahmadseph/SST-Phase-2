export default function getResource(label) {
    const resources = {
        items: 'Articles',
        item: 'Article',
        substitution: 'Préférences de substitution',
        itemsInOrder: 'Articles de la commande',
        substituteWith: 'Échanger par :',
        doNotsubstitute: 'Ne pas remplacer',
        size: 'Format'
    };

    return resources[label];
}
