export default function getResource(label, vars = []) {
    const resources = {
        termsAndConditions: 'By clicking “Sign In”, you (1) agree to the current version of our ',
        termsOfUse: 'TERMS OF USE',
        termsAndConditionsRest: ', and (2) have read Sephora’s ',
        privacyPolicy: 'Privacy Policy'
    };

    return resources[label];
}
