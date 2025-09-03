export default function getResource(label, vars = []) {
    const resources = {
        applyText: 'Appliquer Rouge',
        rewardsText: 'Récompenses',
        infoText: 'Les récompenses Rouge ne peuvent pas être appliquées aux commandes « Achetez en ligne, ramassez en magasin ».',
        rougeReward: `${vars[0]} $ en récompenses Rouge`,
        expires: `*${vars[0]} $ de réduction* • Expire le ${vars[1]}`,
        expiresDate: `Expire le ${vars[0]}`,
        applied: `*${vars[0]} $* de réduction* appliqué`,
        switchToUS: 'La récompense Rouge ne peut être utilisée que dans le pays où la récompense a été échangée. Veuillez passer à notre expérience de magasinage aux États-Unis pour utiliser cette récompense.',
        switchToCA: 'La récompense Rouge ne peut être utilisée que dans le pays où la récompense a été échangée. Veuillez passer à notre expérience de magasinage au Canada pour utiliser cette récompense.'
    };

    return resources[label];
}
