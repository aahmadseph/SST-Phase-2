export default function getResource(label, vars = []) {
    const resources = {
        submissionError: 'Erreur de soumission',
        thankYou: 'Merci',
        somethingWentWrongError: 'Une erreur s’est produite pendant le processus de soumission. Veuillez réessayer plus tard.',
        reviewsPostMessage: 'Les commentaires sont habituellement publiés dans les 72 heures suivant leur soumission; alors restez à l’écoute. Merci de nous aider à améliorer la communauté Sephora!',
        continueShopping: 'Continuer à magasiner'
    };
    return resources[label];
}
