export default function getResource(label, vars = []) {
    const resources = {
        moreDeliveryOptions: 'D’autres options de livraison',
        optionalCharactersMax: `Facultatif (maximum de ${vars[0]} caractères)`,
        noSpecialCharsAllowed: 'Les caractères spéciaux ne sont pas autorisés.',
        selectedDeliveryMethodMessage: `Le mode de livraison choisi n’est pas valable avec le code promotionnel ${vars[0]} : ${vars[1]}. Vous devez sélectionner ${vars[2]} pour qu’il soit valide. Si vous continuez, la promotion ${vars[3]} sera retirée.`,
        confirmation: 'Confirmation',
        continueButton: 'Continuer',
        freeShipSignIn: `${vars[0]} ou ${vars[1]} pour profiter de ${vars[2]}.`,
        signIn: 'Ouvrir une session',
        createAccount: 'créer un compte',
        freeStandardShipping: 'livraison standard GRATUITE'
    };

    return resources[label];
}
