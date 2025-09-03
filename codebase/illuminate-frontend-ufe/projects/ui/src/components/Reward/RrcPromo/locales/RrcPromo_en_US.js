export default function getResource(label, vars = []) {
    const resources = {
        applyText: 'Apply Rouge',
        rewardsText: 'Rewards',
        infoText: 'Rouge Rewards cannot be applied to Buy Online, Pick Up in Store orders.',
        rougeReward: `$${vars[0]} Rouge Reward`,
        expires: `*$${vars[0]} off* • Exp ${vars[1]}`,
        expiresDate: `Expires ${vars[0]}`,
        applied: `*$${vars[0]} off* applied`,
        switchToUS: 'Rouge Reward can only be used in the country where the reward was redeemed. Please switch to our US shopping experience to use this reward.',
        switchToCA: 'Rouge Reward can only be used in the country where the reward was redeemed. Please switch to our Canada shopping experience to use this reward.'
    };

    return resources[label];
}
