export default function getResource(label, vars = []) {
    const resources = {
        removeCreditCard: 'Remove a card',
        maxCreditCardsMessage: `You can have up to ${vars[0]} credit cards. Please delete one and try to add again.`,
        continue: 'Continue'
    };

    return resources[label];
}
