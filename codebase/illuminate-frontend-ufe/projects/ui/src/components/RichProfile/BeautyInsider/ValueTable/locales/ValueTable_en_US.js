export default function getResource(label, vars = []) {
    const resources = {
        moreInformation: 'More information',
        creditCardRewards: 'Credit Card Rewards Earned',
        yearEarnings: `Your ${vars[0]} earnings will appear here`,
        keepShopping: 'Keep shopping to get rewards, benefits, and discounts!',
        pointsEarned: 'Points Earned',
        basePoints: 'Base Points',
        bonusPoints: 'Bonus Points',
        promos: 'Promos & Discount Applied',
        rougeRewardsEarned: 'Rouge Rewards Earned',
        biCashApplied: 'Beauty Insider Cash Applied',
        shopNow: 'Shop Now',
        referralPointsEarned: 'Referral Points Earned',
        points: 'points'
    };

    return resources[label];
}
