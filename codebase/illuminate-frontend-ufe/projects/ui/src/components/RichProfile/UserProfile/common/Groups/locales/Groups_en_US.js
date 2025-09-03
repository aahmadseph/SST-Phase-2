export default function getResource(label, vars = []) {
    const resources = {
        featuredGroups: 'Featured Groups',
        groups: 'Groups',
        myGroups: 'My Groups',
        joinGroupMessage: 'You’re in good company. Join groups to discover inspiring content and meet like-minded Beauty Insider members.',
        hasntJoinedAnyGroupsYet: `${vars[0]} hasn’t joined any groups yet.`,
        exploreAllGroups: 'Explore all groups'
    };
    return resources[label];
}
