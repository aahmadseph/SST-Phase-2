export default function getResource(label, vars = []) {
    const resources = {
        congrats: `Congrats ${vars[0]}!`,
        hi: `Hi, ${vars[0]}`,
        points: 'points',
        summary: 'Your Beauty Insider Summary',
        birthdayGiftTitle: 'Choose Your Birthday Gift',
        bankRewards: `Credit Card Rewards: $${vars[0]}`,
        showCard: 'Show Beauty Insider Card',
        barcodeTitle: 'Your Beauty Insider Card',
        barcodeDesc: 'Scan this barcode at checkout in the store to earn points and redeem rewards.',
        dollarsSaved: `Your ${vars[0]} savings at a glance`,
        pointsMultiplierText: `Point Multiplier Event: Earn *${vars[0]}* points on your purchases`,
        referEarn: 'Refer & Earn: ',
        pointsUppercase: 'Points',
        rougeRewardsApply: `Rouge Rewards: Apply to your purchase for up to *${vars[0]} off*`,
        rougeMemberFreeSameDayDelivery: 'As a Rouge member, you can try *Free Same-Day Delivery*!',
        freeShip: 'You get *FREE standard shipping* on all orders',
        SDDRougeTestFreeShipping: `As a Rouge member, you can try *Free Same-Day Delivery* on $${vars[0]}+ orders`
    };

    return resources[label];
}
