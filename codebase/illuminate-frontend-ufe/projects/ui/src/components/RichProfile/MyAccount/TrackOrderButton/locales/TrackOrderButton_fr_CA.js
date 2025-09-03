export default function getResource(label, vars = []) {
    const resources = {
        track: 'Suivre et obtenir des mises à jour par texto',
        getFacebook: 'Obtenez des mises à jour Facebook Messenger sur votre commande',
        trackCanceled: 'Suivi non disponible pour les commandes annulées.',
        trackUnavailable: 'Le suivi sera disponible lors de l’expédition de la commande.',
        viewTrackingInfo: 'Afficher les informations de suivi'
    };
    return resources[label];
}
