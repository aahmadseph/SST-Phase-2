export default function getResource(label, vars = []) {
    const resources = {
        samplesSelectedText: `${vars[0]} of ${vars[1]} sample(s) selected`,
        selectSamplesOrderText: `You can select up to ${vars[0]} sample(s) per order.`
    };

    return resources[label];
}
