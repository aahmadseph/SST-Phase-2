export default function getResource(label, vars = []) {
    const resources = {
        beautyInsiderCommunity: 'Beauty Insider Community',
        beautyInsiderDescription: 'Real people. Real talk. Real time. Find beauty inspiration, ask questions, and get the right recommendations from Beauty Insider members like you. You ready?',
        startNow: 'Start Now',
        exploreThecommunity: 'Explore the community'
    };
    return resources[label];
}
