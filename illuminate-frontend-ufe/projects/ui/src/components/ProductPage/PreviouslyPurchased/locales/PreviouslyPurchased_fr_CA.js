export default function getResource(label, vars = []) {
    const resources = {
        purchased: 'Purchased',
        time: 'time',
        times: 'times',
        lastPurchase: 'Last purchase:'
    };
    return resources[label];
}
