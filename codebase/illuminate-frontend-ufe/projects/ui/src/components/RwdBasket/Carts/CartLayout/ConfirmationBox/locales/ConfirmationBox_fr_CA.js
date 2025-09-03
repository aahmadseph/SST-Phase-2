export default function getResource(label) {
    const resources = {
        movedToYour: 'a été déplacé dans votre',
        gotIt: 'Compris',
        undo: 'Annuler',
        Pickup: 'Commande « Achetez en ligne, ramassez en magasin ».',
        Sameday: 'Commande de livraison le jour même.',
        Standard: 'Commande d’articles à expédier.',
        subItemRemoved: 'Votre article de remplacement a été retiré.'
    };

    return resources[label];
}
