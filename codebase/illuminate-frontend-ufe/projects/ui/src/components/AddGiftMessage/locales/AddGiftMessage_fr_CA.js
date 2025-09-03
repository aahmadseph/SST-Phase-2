export default function getResource(label, vars = []) {
    const resources = {
        addGiftMessage: 'Ajouter un message',
        giftMessageAdded: 'Message cadeau ajouté',
        edit: 'Modifier',
        remove: 'Retirer'
    };

    return resources[label];
}
