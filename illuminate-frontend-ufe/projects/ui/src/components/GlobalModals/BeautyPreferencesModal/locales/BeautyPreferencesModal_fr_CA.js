export default function getResource(label, vars = []) {
    const resources = {
        modalTitle: 'Ajouter vos préférences beauté',
        skipThisQuestion: 'Ignorer cette question',
        next: 'Suivant',
        done: 'Terminé',
        modalSubTitle1: 'Félicitations! Vous êtes désormais membre Beauty Insider.',
        modalSubTitle2: 'Répondez à deux questions rapides pour une expérience de magasinage plus personnalisée.',
        apiErrorModalTitle: 'Modifications non enregistrées',
        apiErrorModalMessage: 'Un problème est survenu lors du traitement de votre soumission. Veuillez essayer de nouveau.',
        buttonText: 'Compris',
        savedTitle: 'Préférences beauté enregistrées',
        savedMessage1: `Vous avez l’air bien, ${vars[0]}! Vous pouvez aller à`,
        savedMessage2: ' pour modifier vos réponses ou nous en dire plus pour obtenir des choix personnalisés.',
        savedMessage3: 'Bon magasinage!',
        linkText: 'Préférences beauté',
        keepGoing: 'Continuez!'
    };

    return resources[label];
}
