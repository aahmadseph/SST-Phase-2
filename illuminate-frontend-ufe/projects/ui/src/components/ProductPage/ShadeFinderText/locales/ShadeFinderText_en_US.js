export default function getResource(label, vars = []) {
    const resources = {
        seeAllFoundations: 'See all foundations',
        matchFound: 'Your shade finder match.',
        noMatches: 'Sorry, no matches found.'
    };
    return resources[label];
}
