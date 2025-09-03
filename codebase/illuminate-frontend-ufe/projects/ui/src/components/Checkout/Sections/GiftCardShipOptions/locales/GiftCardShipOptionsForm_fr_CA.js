export default function getResource(label) {
    const resources = { giftCardMessage: 'Ce message sera imprimé et inclus avec votre carte-cadeau.' };

    return resources[label];
}
