export default function getResource(label, vars = []) {
    const resources = {
        celebrationGiftTitle: 'Cadeau pour célébrer votre échelon',
        celebrationGiftSubtitle: 'Félicitations, {0}!',
        rewardsTitle: 'De la foire aux récompenses Rewards Bazaar®',
        birthdayGiftTitle: 'Choisissez votre cadeau d’anniversaire',
        birthdayGiftSubtitle: 'Joyeux anniversaire, {0}!',
        infoModalWarningTitle: 'Avertissement'
    };

    return resources[label];
}
