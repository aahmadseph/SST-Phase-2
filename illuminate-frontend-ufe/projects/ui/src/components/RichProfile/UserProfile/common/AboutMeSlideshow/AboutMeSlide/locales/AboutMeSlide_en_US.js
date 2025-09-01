export default function getResource(label, vars = []) {
    const resources = {
        createANickname: '[ Create a nickname ]',
        tapToSee: 'Tap to see',
        clickToSee: 'Click to see',
        thisMembersFollowers: 'this member’s followers and who they’re following!',
        following: 'following',
        follower: 'follower',
        followers: 'followers',
        gotIt: 'Got it',
        userProfileMessageTap: '<b>Tap to see</b> your followers and who you’re following!',
        userProfileMessageClick: '<b>Click to see</b> your followers and who you’re following!',
        otherUserProfileMessageTap: '<b>Tap to see</b> this member’s followers and who they’re following!',
        otherUserProfileMessageClick: '<b>Click to see</b> this member’s followers and who they’re following!'
    };
    return resources[label];
}
