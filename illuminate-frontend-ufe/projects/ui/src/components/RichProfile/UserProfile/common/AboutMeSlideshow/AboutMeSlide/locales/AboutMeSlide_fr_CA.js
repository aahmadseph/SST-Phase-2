export default function getResource(label, vars = []) {
    const resources = {
        createANickname: '[ Create a nickname ]',
        tapToSee: 'Touchez pour voir',
        clickToSee: 'Cliquez pour voir',
        thisMembersFollowers: 'voir les abonnés de ce membre et qui il suit!',
        following: 'suivis',
        follower: 'abonné',
        followers: 'abonnés',
        gotIt: 'Compris',
        userProfileMessageTap: '<b>Appuyez ici</b> pour voir vos abonnés et les personnes que vous suivez!',
        userProfileMessageClick: '<b>Cliquez ici</b> pour voir vos abonnés et les personnes que vous suivez!',
        otherUserProfileMessageTap: '<b>Appuyez ici</b> pour voir les abonnés de ce membre et les personnes qu’il suit!',
        otherUserProfileMessageClick: '<b>Cliquez ici</b> pour voir les abonnés de ce membre et les personnes qu’il suit!'
    };
    return resources[label];
}
