export default function getResource(label, vars = []) {
    const resources = {
        basket: 'Basket',
        brandsList: 'Sephora Brands List',
        lists: 'Lists',
        lovesList: 'Loves List',
        purchaseHistory: 'Purchase History',
        inStoreServices: 'In-Store Services',
        writeAReview: 'Write a Review',
        orderConfirmation: 'Order Confirmation',
        orderDetail: 'Order Detail',
        profile: 'Profile',
        beautyInsider: 'Beauty Insider',
        myAccount: 'My Account',
        recentOrders: 'Recent Orders',
        subscriptions: 'Subscriptions',
        autoReplenishment: 'Auto-Replenishment',
        reservations: 'Reservations',
        savedAddresses: 'Saved Addresses',
        paymentsAndCredits: 'Payments & Credits',
        emailAndMailPreferences: 'Email & Mail Preferences',
        beautyForum: 'Beauty Forum | Sephora Community',
        gallery: 'Gallery | Sephora Community',
        addPhoto: 'Add Photo | Sephora Community',
        sitemapDepartments: 'Beauty Departments Sitemap',
        beautyPreferences: 'Beauty Preferences'
    };

    return resources[label];
}
