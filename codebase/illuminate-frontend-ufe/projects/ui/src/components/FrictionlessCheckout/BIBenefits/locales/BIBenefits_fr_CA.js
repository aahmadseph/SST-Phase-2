export default function getResource(label, vars = []) {
    const resources = {
        title: 'Tous les privilèges Beauty Insider',
        biPoints: `Vous avez actuellement <b>${vars[0]} points</b>`,
        enterPromoCode: 'Inscrire le code promo',
        rougeBadge: 'EXCLUSIVITÉ ROUGE'
    };

    return resources[label];
}
