export default function getResource(label, vars = []) {
    const resources = {
        title: 'Apply Rouge Rewards',
        apply: 'Apply',
        applied: 'Applied',
        remove: 'Remove',
        bopisRougeMessage: 'Only eligible in your ',
        bopisRougeMessageRedirect: 'Shipping and Delivery basket',
        rougeRewardsMessage: `<b>${vars[0]} off</b> • Exp ${vars[1]}`,
        newRougeRewardsMessage: `<b>${vars[0]} off</b> available • Exp ${vars[1]}`,
        rougeRewardsAppliedMessage: `<b>${vars[0]} off</b> applied`,
        switchToUS: 'Rouge Reward can only be used in the country where the reward was redeemed. Please switch to our US shopping experience to use this reward.',
        switchToCA: 'Rouge Reward can only be used in the country where the reward was redeemed. Please switch to our Canada shopping experience to use this reward.',
        sameDayDeliveryRougeMessage: 'Rouge Rewards are not available for this order type.',
        checkoutTitle: 'Apply Rouge Reward'
    };

    return resources[label];
}
