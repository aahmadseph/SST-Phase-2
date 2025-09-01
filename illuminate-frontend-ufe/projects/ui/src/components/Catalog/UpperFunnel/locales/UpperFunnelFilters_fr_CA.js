export default function getResource(label, vars = []) {
    const resources = {
        chooseStore: 'Choisir un magasin',
        setYourLocation: 'Définir votre emplacement',
        pickup: 'Ramassage',
        reset: 'Réinitialiser',
        pickupSelectedAriaDescription: `Le magasin ${vars[0]} où ramasser la commande est sélectionné`,
        pickupNotSelectedAriaDescription: 'La sélection d’un magasin où ramasser la commande peut automatiquement actualiser les résultats des produits affichés pour mieux correspondre au magasin sélectionné.',
        sameDaySelectedAriaDescription: `L’emplacement pour la livraison le jour même ${vars[0]} est sélectionné`,
        sameDayNotSelectedAriaDescription: 'La sélection d’un emplacement pour la livraison le jour même peut automatiquement actualiser les résultats des produits affichés pour mieux correspondre à l’emplacement de la livraison.'
    };

    return resources[label];
}
