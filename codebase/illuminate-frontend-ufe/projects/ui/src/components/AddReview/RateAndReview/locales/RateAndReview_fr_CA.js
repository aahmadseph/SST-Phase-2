export default function getResource(label, vars = []) {
    const resources = {
        review: 'Commentaire',
        rateHeading: 'Évaluer ce produit',
        writeReview: 'Rédiger votre commentaire',
        writeReviewExample: 'Exemple : J’utilise ce produit depuis quelques semaines déjà. Et je dois dire que j’adore les résultats! Il m’a aidée à hydrater ma peau sèche. Il est facile à appliquer, et la formule est…',
        rateAndReview: 'Évaluer et commenter',
        headline: 'Titre',
        headlineExample: 'Exemple : Un incontournable de mon rituel!',
        optional: 'facultatif',
        addAHeadline: 'Ajouter un titre',
        maxChar: `Max. ${vars[0]} caractères`,
        seeFull: 'Voir en entier',
        addPhoto: 'Ajouter une photo',
        upToTwoImages: 'jusqu’à deux images',
        wouldYouRecommendThisProduct: 'Recommanderiez-vous ce produit?',
        yes: 'Oui',
        no: 'Non',
        productAsAfreeSample: 'J’ai reçu quelque chose en échange de cette publication (produit gratuit, paiement, participation à une promotion)',
        sephoraEmployee: 'Je suis un employé de Sephora',
        next: 'Suivant',
        errorMessageText: `L’évaluation doit comporter au moins ${vars[0]} caractères`,
        errorMessageRating: 'Veuillez sélectionner une étoile pour évaluer',
        errorMessageTextRecommend: 'Veuillez faire un choix',
        termsAndConditions: 'conditions d’utilisation de Sephora',
        termsError: 'Vous devez accepter nos conditions d’utilisation pour continuer',
        yesAgree: 'Oui, j’accepte'
    };
    return resources[label];
}
