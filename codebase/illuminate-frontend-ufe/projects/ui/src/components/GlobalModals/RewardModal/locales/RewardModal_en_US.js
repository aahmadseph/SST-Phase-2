export default function getResource(label, vars = []) {
    const resources = {
        beautyInsiderRewards: 'Beauty Insider Rewards',
        done: 'Done',
        status: 'Status',
        points: 'points',
        youNowHave: 'You now have',
        youAreExceeding: 'You are exceeding by'
    };

    return resources[label];
}
