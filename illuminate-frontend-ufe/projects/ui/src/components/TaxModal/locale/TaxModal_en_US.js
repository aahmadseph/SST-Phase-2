export default function getResource(label, vars = []) {
    const resources = {
        taxModalTitle: 'Estimated Tax',
        taxModalText: 'Final tax will be calculated at the time of payment, per local tax policies',
        gotIt: 'Got It'
    };

    return resources[label];
}
