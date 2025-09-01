export default function getResource(label, vars = []) {
    const resources = {
        title: 'Apply Credit Card Rewards',
        available: 'available',
        selectThree: 'Select up to three',
        creditCardReward: `<b>$${vars[0]}</b> Credit Card Reward`,
        firstTimeDiscount: `<b>${vars[0]}</b> First Purchase discount`,
        expiry: `Exp ${vars[0]}`,
        orderSubTotal: 'Order Subtotal',
        apply: 'Apply',
        applied: 'Applied',
        remove: 'Remove',
        ccMessage: '*With your Sephora Credit card or Sephora Visa. Exclusions apply, ',
        ccMessageWithoutStar: 'With your Sephora Credit card or Sephora Visa. Exclusions apply, ',
        clickHere: 'click here for details',
        done: 'Done',
        maxRewardsReached: 'You\'ve reached the maximum number of credit card rewards per order.',
        off: 'off'
    };

    return resources[label];
}
