export default function getResource(label, vars = []) {
    const resources = {
        add: 'Add',
        happyBday: 'Happy B-Day',
        chooseGift: 'Choose Your Birthday Gift',
        daysToRedeem: `<b>${vars[0]}</b> days left to redeem`,
        viewAll: 'View All'
    };

    return resources[label];
}
