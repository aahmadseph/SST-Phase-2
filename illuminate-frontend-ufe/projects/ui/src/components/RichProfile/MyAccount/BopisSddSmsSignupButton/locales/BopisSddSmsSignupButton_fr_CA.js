export default function getResource(label, vars = []) {
    const resources = {
        getSmsUpdates: 'Recevoir des mises à jour par texto',
        alreadyEnrolled: 'Déjà inscrit aux mises à jour par texto',
        orderDetailsAndSmsUpdates: 'Consulter les détails de la commande et recevoir des mises à jour par texto'
    };
    return resources[label];
}
