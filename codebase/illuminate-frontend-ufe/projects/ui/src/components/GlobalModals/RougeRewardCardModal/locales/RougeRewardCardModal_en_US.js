export default function getResource(label, vars = []) {
    const resources = {
        biTermsAndConditions: 'Beauty Insider Terms and Conditions',
        termsAndConditions: 'Terms and conditions',
        required: '(required)'
    };

    return resources[label];
}
