export default function getResource(label, vars = []) {
    const resources = {
        termsOfUseLink: 'conditions d’utilisation de Sephora',
        privacyPolicyLink: 'politique de confidentialité',
        privacyPolicyTitle: 'politique de confidentialité',
        termsOfUseTitle: 'Conditions d’utilisation de Sephora'
    };

    return resources[label];
}
