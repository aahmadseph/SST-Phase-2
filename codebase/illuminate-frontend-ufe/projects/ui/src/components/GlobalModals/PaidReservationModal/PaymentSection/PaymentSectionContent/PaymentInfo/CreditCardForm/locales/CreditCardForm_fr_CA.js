export default function getResource(label, vars = []) {
    const resources = {
        cardNumber: 'Numéro de carte',
        cvc: 'CVV/CVC',
        firstName: 'Prénom',
        lastName: 'Nom de famille',
        expiredMessage: 'Carte de crédit expirée.',
        endingIn: 'se terminant par',
        mm: 'MM',
        yy: 'AA'
    };

    return resources[label];
}
