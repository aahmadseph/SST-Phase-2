export default function getResource(label, vars = []) {
    const resources = {
        sameDayUnlimited: 'Same-Day Unlimited',
        memberSince: 'Member since',
        annually: 'Annually',
        cancelSubscription: 'Cancel Subscription',
        sduSavingsUS: '$6.95',
        sduSavingsCA: '$9.95',
        paymentMethod: 'Payment Method',
        edit: 'Edit',
        renews: 'Renews',
        paymentBegins: 'Payment begins',
        membershipPerks: 'Membership Perks',
        subscriptionCanceled: 'Your subscription has been canceled',
        canceled: 'Canceled',
        expiresOn: 'Expires on'
    };

    return resources[label];
}
