export default function getResource(label, vars = []) {
    const resources = {
        annually: 'annually',
        paymentRenews: 'Payment renews on',
        paymentBegins: 'Payment begins on',
        free30DayTrial: 'FREE 30-day trial'
    };

    return resources[label];
}
