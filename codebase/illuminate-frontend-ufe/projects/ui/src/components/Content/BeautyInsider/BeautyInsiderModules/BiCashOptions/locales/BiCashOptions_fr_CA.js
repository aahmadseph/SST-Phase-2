export default function getResource(label, vars = []) {
    const resources = {
        pointsNumber: `${vars[0]} points`,
        apply: 'Appliquer',
        purchase: 'à votre achat pour',
        canApply: `Échanger ${vars[0]} points lors de votre achat pour`,
        canApplyUpTo: `Vous pouvez maintenant utiliser jusqu’à ${vars[0]} points pour`,
        pointText: 'point',
        pointsText: 'points',
        missingPointsClose: `Il ne vous manque que ${vars[0]} ${vars[1]} pour avoir droit à ${vars[2]} de réduction.`,
        onceYouEarn: `Quand vous aurez accumulé ${vars[0]} points, vous pourrez les échanger pour profiter d’une réduction de ${vars[1]}.`,
        cashWillApplyHere: 'Vos dollars Beauty Insider seront affichés ici.',
        applyInBasket: 'Appliquer dans le panier',
        shopToEarnPoints: 'Magasiner pour accumuler des points',
        BICash: 'Dollars Beauty Insider',
        BICashOptions: 'Options dollars Beauty Insider',
        off: 'de réduction'
    };
    return resources[label];
}
