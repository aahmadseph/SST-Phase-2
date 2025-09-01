export default function getResource(label, vars = []) {
    const resources = {
        error: 'Erreur',
        submissionError: 'Un problème est survenu lors du traitement de votre soumission. Veuillez réessayer plus tard.',
        ok: 'OK',
        phoneNumberRejected: 'Type de téléphone non valide. Veuillez vérifier votre saisie ou utiliser des données valides.'
    };

    return resources[label];
}
