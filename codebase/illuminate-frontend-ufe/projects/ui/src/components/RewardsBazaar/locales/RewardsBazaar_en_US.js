export default function getResource(label, vars = []) {
    const resources = {
        '50 Points': '50 Points',
        '100 Points': '100 Points',
        '250-499 Points': '250-499 Points',
        '500-749 Points': '500-749 Points',
        '750-2999 Points': '750-2999 Points',
        '3000-4999 Points': '3000-4999 Points',
        '5000-19999 Points': '5000-19999 Points',
        '20000+ Points': '20000+ Points',
        chooseYour: `Choose Your ${vars[0]}`,
        rougeBadge: 'ROUGE',
        daysToRedeem: `<b>${vars[0]}</b> days left to redeem`
    };

    return resources[label];
}
