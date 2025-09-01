export default function getResource(label, vars = []) {
    const resources = {
        creditOrDebitCard: 'Cartes de crédit ou de débit',
        edit: 'Modifier',
        remove: 'Retirer',
        useThisCard: 'Utiliser cette carte',
        cardIsExpired: 'Cette carte est expirée. Veuillez mettre à jour les informations ou utiliser une autre carte.'
    };

    return resources[label];
}
