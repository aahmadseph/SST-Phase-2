export default function getResource(label, vars = []) {
    const resources = {
        biTermsAndConditions: 'Modalités du programme Beauty Insider',
        termsAndConditions: 'Modalités et conditions',
        required: '(requis)'
    };

    return resources[label];
}
