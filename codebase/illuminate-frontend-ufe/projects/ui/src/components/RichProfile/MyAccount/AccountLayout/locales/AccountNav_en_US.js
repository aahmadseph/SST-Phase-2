export default function getResource(label, vars = []) {
    const resources = {
        accountNavigation: 'Account Navigation',
        accountInformation: 'Account Information',
        recentOrders: 'Recent Orders',
        subscriptions: 'Subscriptions',
        reservations: 'Reservations',
        savedAddresses: 'Saved Addresses',
        paymentsCredits: 'Payments & Credits',
        emailPreferences: 'Email & Mail Preferences',
        autoReplenish: 'Auto-Replenish',
        sameDayUnlimited: 'Same-Day Unlimited'
    };

    return resources[label];
}
