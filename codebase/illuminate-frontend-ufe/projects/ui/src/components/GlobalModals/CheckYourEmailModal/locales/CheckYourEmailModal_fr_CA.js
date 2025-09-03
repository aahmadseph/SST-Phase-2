const resources = {
    title: 'Vérifier votre adresse courriel',
    clickVerificationLink1: 'Veuillez cliquer sur le lien de vérification que nous vous avons envoyé par courriel',
    clickVerificationLink2: 'afin de configurer votre compte',
    didntGetIt: 'Vous ne l’avez pas reçu? Vérifiez vos dossiers de pourriels ou',
    completeAccountSetup: 'Nous vous avons envoyé un courriel pour terminer la configuration de votre compte. Veuillez terminer la configuration de votre compte pour définir un mot de passe.',
    didntGetEmail: 'Vous n’avez pas reçu le courriel? Vérifiez votre dossier de pourriels ou',
    resend: 'envoyez le courriel à nouveau',
    confirmButton: 'OK',
    emailResent: 'Courriel renvoyé avec succès.',
    emailResentError: 'Un problème est survenu et nous ne pouvons pas renvoyer le courriel. Veuillez réessayer plus tard ou renvoyez le courriel.',
    tokenValidationError: 'Le lien de vérification de votre compte a expiré ou est invalide. Veuillez renvoyer le courriel ou obtenir un nouveau lien.',
    error: 'Erreur',
    success: 'Réussi'
};

export default function getResource(label, vars = []) {
    return resources[label];
}
