export default function getResource(label, vars = []) {
    const resources = {
        noFollowersMessage: 'You don’t have any followers yet.',
        noFollowersMessageBr: 'Your followers will appear here.',
        memberHasNoFollowers: 'No one is following this member yet.',
        noFollowingAnyoneYet: 'You are not following anyone yet.',
        followingInstructions: 'Following someone is as easy as hitting the “Follow” button on their profile.',
        toViewYourProfile: 'To view your profile, please',
        signIn: 'sign in',
        followers: 'Followers',
        following: 'Following',
        noFollowing: 'is not following anyone yet.',
        follow: 'Follow',
        backToProfileLink: 'Back to Profile',
        backToProfileLinkNickname: `Back to ${vars[0] + '’s'} Profile`,
        followUser: `Follow ${vars[0]}`
    };
    return resources[label];
}
