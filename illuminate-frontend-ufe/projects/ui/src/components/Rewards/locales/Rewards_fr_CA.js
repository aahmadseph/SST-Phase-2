export default function getResource(label, vars = []) {
    const resources = { tierCelebrationGift: 'Cadeau pour célébrer votre échelon' };

    return resources[label];
}
