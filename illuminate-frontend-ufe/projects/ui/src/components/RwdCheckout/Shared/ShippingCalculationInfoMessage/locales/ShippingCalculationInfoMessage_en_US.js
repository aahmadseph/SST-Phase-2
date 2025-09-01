export default function getResource(label, vars = []) {
    const resources = {
        updatedShippingCalculations: 'We’ve updated our shipping calculations to make them more accurate and give you a better idea of when your package will arrive.',
        gotIt: 'Got it'
    };

    return resources[label];
}
