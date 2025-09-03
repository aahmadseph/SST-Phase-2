export default function getResource(label, vars = []) {
    const resources = {
        ccReward: 'Credit Card Reward*',
        exp: 'Exp.'
    };

    return resources[label];
}
