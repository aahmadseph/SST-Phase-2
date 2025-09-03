export default function getResource(label, vars = []) {
    const resources = {
        myCardSummary: 'My Credit Card Summary',
        manageMyCard: 'Pay My Bill',
        yourRewards: 'Your Rewards',
        availableNow: 'Available Now',
        scanInStore: 'Scan reward cards in store',
        applyInBasket: 'Apply Rewards in Basket',
        available: 'Available',
        availableTime: 'These rewards become available at the end of your next billing period.',
        earningNextStatement: 'Earning on next statement',
        yearToDate: 'Year-to-date',
        rewardsEarned: 'Rewards Earned',
        rewardsBreakdown: 'Rewards Breakdown',
        creditCardReward: 'Credit Card Reward',
        appliedToBasket: 'Applied to Basket',
        remove: 'Remove',
        underReview: 'Your credit card application is under review.',
        decorativeBannerImage: 'decorative banner image',
        reviewMessage: 'Hang tight—Comenity Capital Bank is currently  reviewing your application, and you’ll be notified by mail within 10 business days. Thanks for your patience.',
        notActive: 'Account not active.',
        questions: 'Questions? We’re always here for you.',
        callCustomerSupport: 'Call customer support at',
        ttdTty: 'TDD/TTY',
        expired: 'Exp.',
        giveTry: 'Give these a try...',
        asOf: 'As of'
    };

    return resources[label];
}
