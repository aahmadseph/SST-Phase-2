export default function getResource(label, vars = []) {
    const resources = {
        userLabelText: `Vous devez être membre ${vars[0]} pour profiter de ce produit.`,
        signIn: 'Ouvrir une session',
        or: 'ou',
        signUp: 'S’inscrire',
        learnMore: 'En savoir plus',
        download: 'Télécharger',
        openApp: 'pour l’acheter, ouvrez l’appli Sephora.',
        bopisTooltip: 'Faites défiler vers le bas et appuyez sur « Livraison le jour même » ou sur « Achetez en ligne, ramassez en magasin » pour recevoir vos essentiels aujourd’hui.',
        SDDRougeFreeShip: 'Faites défiler vers le bas et appuyez sur « Livraison le jour même » pour profiter gratuitement de ce privilège en tant que membre Rouge.',
        SDDRougeTestFreeShipping: `Faites défiler vers le bas et appuyez sur « Livraison le jour même » pour profiter gratuitement de ce privilège sur les commandes de ${vars[0]} $ ou plus en tant que membre Rouge.`
    };
    return resources[label];
}
