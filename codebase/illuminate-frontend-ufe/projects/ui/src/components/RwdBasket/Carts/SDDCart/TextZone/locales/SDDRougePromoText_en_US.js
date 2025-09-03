export default function getResource(label, vars = []) {
    const resources = {
        SDDRougeTestBelowThresholdMessage: `As a Rouge member, get FREE Same-Day Delivery by adding ${vars[0]}.`,
        SDDRougeTestAboveThresholdMessage: 'As a Rouge member, you’re getting FREE Same-Day Delivery.'
    };

    return resources[label];
}
