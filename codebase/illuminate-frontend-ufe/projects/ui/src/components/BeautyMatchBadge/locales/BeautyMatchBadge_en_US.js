export default function getResource(label, vars = []) {
    const resources = {
        beautyMatch: 'Beauty Match',
        beautyMatches: 'Beauty Matches'
    };
    return resources[label];
}
