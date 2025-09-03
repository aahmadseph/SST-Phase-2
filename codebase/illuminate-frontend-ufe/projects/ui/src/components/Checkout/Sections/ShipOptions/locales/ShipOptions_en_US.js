export default function getResource(label, vars = []) {
    const resources = {
        moreDeliveryOptions: 'More delivery options',
        optionalCharactersMax: `Optional (${vars[0]} character max)`,
        noSpecialCharsAllowed: 'No special characters are allowed.',
        selectedDeliveryMethodMessage: `The selected delivery method is not valid with the promotion code ${vars[0]}: ${vars[1]}. You must select ${vars[2]} to qualify. If you continue, the shipping promotion ${vars[3]} will be removed.`,
        confirmation: 'Confirmation',
        continueButton: 'Continue',
        freeShipSignIn: `${vars[0]} or ${vars[1]} to enjoy ${vars[2]}.`,
        signIn: 'Sign in',
        createAccount: 'create an account',
        freeStandardShipping: 'FREE standard shipping'
    };

    return resources[label];
}
