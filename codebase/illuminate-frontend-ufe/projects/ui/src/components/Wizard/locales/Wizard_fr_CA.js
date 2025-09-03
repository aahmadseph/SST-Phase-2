export default function getResource(label, vars = []) {
    const resources = {
        back: 'Retour',
        retake: 'Reprendre',
        saveAndContinue: 'Enregistrer et continuer',
        signInToSave: 'Ouvrir une session pour enregistrer',
        seeMatchingProducts: 'Voir les produits correspondants',
        apiErrorModalTitle: 'Erreur',
        apiErrorModalMessage: 'Une erreur est survenue et nous n’avons pas pu traiter votre demande. Veuillez réessayer plus tard.',
        errorButtonText: 'OK',
        joinBI: 'Inscrivez-vous au programme Beauty Insider pour économiser'
    };

    return resources[label];
}
