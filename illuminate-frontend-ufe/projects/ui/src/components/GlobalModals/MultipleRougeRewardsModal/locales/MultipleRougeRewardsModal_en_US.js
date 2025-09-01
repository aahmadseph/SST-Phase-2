export default function getResource(label, vars = []) {
    const resources = {
        title: 'Apply Rouge Rewards',
        apply: 'Apply',
        applied: 'Applied',
        remove: 'Remove',
        rougeRewardsSubText: `$${vars[0]} Rouge Reward`,
        rougeRewardsExpirationMessage: `Exp ${vars[0]}`,
        done: 'Done',
        switchToUS: 'Rouge Reward can only be used in the country where the reward was redeemed. Please switch to our US shopping experience to use this reward.',
        switchToCA: 'Rouge Reward can only be used in the country where the reward was redeemed. Please switch to our Canada shopping experience to use this reward.',
        checkoutTitle: 'Rouge Reward',
        subtitle: 'Apply a Rouge Reward to Your Purchase'
    };

    return resources[label];
}
