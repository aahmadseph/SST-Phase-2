export default function getResource(label, vars = []) {
    const resources = {
        SDDRougeTestBelowThresholdMessage: `En tant que membre Rouge, profitez de la livraison le jour même GRATUITE en ajoutant ${vars[0]}.`,
        SDDRougeTestAboveThresholdMessage: 'En tant que membre Rouge, vous pouvez essayer la livraison le jour même GRATUITE.'
    };

    return resources[label];
}
