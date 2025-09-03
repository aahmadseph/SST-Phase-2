export default function getResource(label, vars = []) {
    const resources = {
        title: 'Credit Card Rewards',
        moreLink: 'More',
        listTitle: 'Credit Card Rewards Earned',
        creditCardReward: 'Credit Card Reward',
        view: 'View',
        more: 'more',
        modalButton: 'Got It'
    };

    return resources[label];
}
