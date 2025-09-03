export default function getResource(label, vars = []) {
    const resources = {
        title: 'Supprimer le numéro de téléphone',
        message: `Souhaitez-vous vraiment supprimer l’élément suivant : <b>${vars[0]}</b>? En supprimant votre numéro de téléphone, il sera plus difficile de trouver votre compte en magasin et de rester informé des offres et des nouveautés exclusives.`,
        messageLine2: 'L’abonnement aux alertes par texto de Sephora actuellement lié au numéro de téléphone ci-dessus sera annulé.',
        ok: 'Oui, continuer',
        cancel: 'Annuler'
    };

    return resources[label];
}
