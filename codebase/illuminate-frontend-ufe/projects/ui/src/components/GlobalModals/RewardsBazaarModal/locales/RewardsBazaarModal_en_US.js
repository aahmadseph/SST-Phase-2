export default function getResource(label, vars = []) {
    const resources = {
        title: 'Add Rewards',
        cancel: 'Cancel',
        remove: 'Remove',
        done: 'Done',
        biPointsText: 'You\'re a',
        biPointsInsiderText: 'You\'re an',
        with: 'with',
        points: 'points.',
        addFullSize: 'Add Full Size',
        addToBasket: 'Add to Basket',
        addToBasketShort: 'Add',
        signInToAccess: 'Sign in to access',
        allRewards: 'All Rewards',
        chooseBirthdayGift: 'Choose Your Birthday Gift',
        birthdayMessage: `Happy B-day, ${vars[0]}!`,
        daysToRedeem: `<b>${vars[0]}</b> days left to redeem`,
        birthdayGiftText: 'Birthday Gift',
        lastChanceRedeemToday: 'Last chance, redeem today!',
        rougeBadge: 'ROUGE'
    };

    return resources[label];
}
