export default function getResource(label, vars = []) {
    const resources = {
        ccReward: 'Récompense carte de crédit*',
        exp: 'Exp.'
    };

    return resources[label];
}
