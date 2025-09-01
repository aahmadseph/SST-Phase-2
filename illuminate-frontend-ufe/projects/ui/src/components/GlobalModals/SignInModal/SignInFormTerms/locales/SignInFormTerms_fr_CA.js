export default function getResource(label, vars = []) {
    const resources = {
        termsAndConditions: 'En cliquant sur « Se connecter », vous (1) acceptez la version actuelle de nos ',
        termsOfUse: 'CONDITIONS D’UTILISATION',
        termsAndConditionsRest: 'et confirmez (2) avoir lu notre ',
        privacyPolicy: 'politique de confidentialité'
    };

    return resources[label];
}
