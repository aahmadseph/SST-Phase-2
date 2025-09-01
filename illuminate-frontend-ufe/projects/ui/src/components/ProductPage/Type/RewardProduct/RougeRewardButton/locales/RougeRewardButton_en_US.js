export default function getResource(label, vars = []) {
    const resources = {
        checkboxContentDefaultText: 'I agree to the Beauty Insider',
        checkboxContentDefaultLink: 'Terms & Conditions'
    };
    return resources[label];
}
