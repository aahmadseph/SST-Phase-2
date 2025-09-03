const resources = {
    new: 'NEW',
    beautyChallenges: 'Beauty Insider Challenges: Earn points when you complete tasks'
};

export default function getResource(label) {
    return resources[label];
}
