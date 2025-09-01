export default function getResource(label, vars = []) {
    const resources = {
        referEarn: 'Refer & Earn',
        ends: `Ends ${vars[0]}`,
        copy: 'Copy',
        copied: 'Copied',
        seeMore: 'See more',
        referralCheckIn: 'Referral Check-In',
        earnedPoints: 'Way to go! By referring friends, you earned ',
        points: 'points.'
    };

    return resources[label];
}
