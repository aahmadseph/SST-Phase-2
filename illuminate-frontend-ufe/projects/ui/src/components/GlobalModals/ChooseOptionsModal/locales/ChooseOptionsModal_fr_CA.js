export default function getResource(label, vars = []) {
    const resources = {
        seeFullDetails: 'Voir tous les détails de l’article',
        chooseOptions: 'Choisissez des options',
        size: `Format ${vars[0]}`,
        appExclusive: 'Pour l’acheter, téléchargez ou ouvrez l’appli Sephora.',
        close: 'Fermer'
    };

    return resources[label];
}
