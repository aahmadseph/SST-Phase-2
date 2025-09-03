export default function getResource(label, vars = []) {
    const resources = {
        emptyBasketMessage: 'Votre panier est actuellement vide.',
        shopNewArrivals: 'Découvrir les nouveautés',
        pleaseSignIn: 'Veuillez ouvrir une session si vous essayez de récupérer un panier créé précédemment.',
        signInText: 'Ouvrir une session'
    };

    return resources[label];
}
