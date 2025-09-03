export default function getResource(label, vars = []) {
    const resources = {
        title: 'Your Summary',
        birthdayGiftTitle: 'Choose Your Birthday Gift',
        bankRewards: `Credit Card Rewards: *$${vars[0]}*`,
        pointsMultiplierText: `Point Multiplier Event: Earn *${vars[0]}* points on your purchases`,
        rougeRewardsApply: `Rouge Rewards: Apply to your purchase for up to *${vars[0]} off*`,
        dollarsSaved: `Your ${vars[0]} savings at a glance`,
        SDDRougeTestFreeShipping: `As a Rouge member, you can try *Free Same-Day Delivery* on $${vars[0]}+ orders`,
        rougeMemberFreeSameDayDelivery: 'As a Rouge member, you can try *Free Same-Day Delivery*!',
        freeShip: 'You get *FREE standard shipping* on all orders',
        rougeBadge: 'ROUGE EXCLUSIVE',
        customerLimitTitle: 'Employee Discount:',
        customerLimitText: `$${vars[0]} of $${vars[1]} limit available until ${vars[2]}.`,
        dtsDownErrorMessage: 'Information is temporary unavailable.'
    };

    return resources[label];
}
