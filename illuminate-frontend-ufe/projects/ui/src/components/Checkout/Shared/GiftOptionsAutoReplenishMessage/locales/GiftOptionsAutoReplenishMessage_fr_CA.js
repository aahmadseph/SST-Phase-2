export default function getResource(label, vars = []) {
    const resources = {
        giftOptionsAutoReplenishMessage: 'Les options de cadeaux ne sont pas disponibles pour les articles à réapprovisionnement automatique.'
    };

    return resources[label];
}
