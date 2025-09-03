export default function getResource(label, vars = []) {
    const resources = {
        celebrationGiftTitle: 'Tier Celebration Gift',
        celebrationGiftSubtitle: 'Congrats, {0}!',
        rewardsTitle: 'From Rewards Bazaar',
        birthdayGiftTitle: 'Choose Your Birthday Gift',
        birthdayGiftSubtitle: 'Happy B-Day, {0}!',
        infoModalWarningTitle: 'Warning'
    };

    return resources[label];
}
