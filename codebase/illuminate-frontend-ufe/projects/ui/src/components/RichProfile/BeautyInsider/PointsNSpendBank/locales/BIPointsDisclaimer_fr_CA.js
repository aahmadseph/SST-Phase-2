export default function getResource(label, vars = []) {
    const resources = {
        listsText: 'Listes',
        firstDisclaimer: '† Vous recevrez 1 point Beauty Insider en tant que membre Insider, 1,25 point Beauty Insider avec l’échelon VIB ou 1,5 point Beauty Insider avec l’échelon Rouge pour chaque dollar dépensé (excluant les cartes-cadeaux électroniques, les cartes-cadeaux, les achats de billets pour les événements spéciaux Sephora, les taxes ou l’expédition) en ligne ou dans un magasin Sephora.',
        secondDisclaimer: `La somme dépensée en une année contribue à l’obtention de votre statut Beauty Insider. Les points sont reportés d’une année à l’autre. Le cumul annuel des dépenses est réactualisé tous les ans le 1er janvier. Les détails de l’année dernière sont disponibles ici, et vous pouvez visionner l’historique de vos achats précédents dans votre ${vars[0]}`,
        thirdDisclaimer: 'Les détails des totaux de la Banque beauté et des dépenses concernant les transactions effectuées avant le premier juin 2014 (inclus) ne sont pas disponibles en ligne.'
    };

    return resources[label];
}
