export default function getResource(label, vars = []) {
    const resources = {
        title: 'Tous les privilèges Beauty Insider',
        signIn: 'Ouvrir une session',
        signInSubText: 'pour voir vos points et profiter des récompenses.',
        applyText: 'Appliquer',
        noBiPoints: `Vous avez maintenant <b>${vars[0]}</b> points Beauty Insider.`,
        biPoints: `Vous avez actuellement <b>${vars[0]} points</b>`,
        cxsMissingMessage: 'Beauty Insider n’est pas disponible pour le moment. Veuillez revenir plus tard.',
        exceededCheckoutPoints: `Vous dépassez de ${vars[0]} points. Veuillez retirer l’argent BI pour passer à la caisse.`,
        joinNow: 'S’inscrire',
        joinNowSubText: 'pour enregistrer vos points et profiter des récompenses.',
        rougeBadge: 'EXCLUSIVITÉ ROUGE'
    };

    return resources[label];
}
