export default function getResource(label, vars = []) {
    const resources = {
        saveMyPointsText: `Oui, accumulez mes ${vars[0]} points Beauty Insider provenant de cet achat.`,
        emailRegisteredText: `${vars[0]} est déjà enregistré chez Sephora. Ouvrez une session après avoir passé la commande pour enregistrer vos points.`,
        joinOurFreeProgramText: 'Après avoir passé la commande, inscrivez-vous à notre programme de fidélisation gratuit pour obtenir des expériences, services personnalisés et échantillons de récompense.'
    };
    return resources[label];
}
