export default function getResource(label, vars = []) {
    const resources = {
        termsOfUseLink: 'Terms of Use',
        privacyPolicyLink: 'Privacy Policy',
        privacyPolicyTitle: 'Privacy Policy',
        termsOfUseTitle: 'Sephora Terms of Use'
    };

    return resources[label];
}
