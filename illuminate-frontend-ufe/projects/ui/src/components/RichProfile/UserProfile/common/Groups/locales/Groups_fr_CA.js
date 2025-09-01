export default function getResource(label, vars = []) {
    const resources = {
        featuredGroups: 'Groupes vedettes',
        groups: 'Groupes',
        myGroups: 'Mes groupes',
        joinGroupMessage: 'Vous êtes bien accompagné(e). Rejoignez des groupes pour découvrir des contenus inspirants et rencontrez des membres Beauty Insider qui vous ressemblent.',
        hasntJoinedAnyGroupsYet: `${vars[0]} n’a encore rejoint aucun groupe`,
        exploreAllGroups: 'Explorer tous les groupes'
    };
    return resources[label];
}
