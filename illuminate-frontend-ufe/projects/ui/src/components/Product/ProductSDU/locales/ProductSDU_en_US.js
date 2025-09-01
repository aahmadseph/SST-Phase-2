export default function getResource(label) {
    const resources = {
        annually: 'annually',
        paymentBeginsOn: 'Payment begins on',
        paymentRenewsOn: 'Payment renews on',
        sephoraSubscription: 'Sephora Subscription',
        sameDayUnlimited: 'Same-Day Unlimited',
        free30DayTrial: 'FREE 30-day trial',
        qty: 'Qty',
        free: 'FREE'
    };
    return resources[label];
}
