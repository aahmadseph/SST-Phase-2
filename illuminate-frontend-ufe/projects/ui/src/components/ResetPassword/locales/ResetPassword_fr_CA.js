export default function getResource(label, vars = []) {
    const resources = {
        resetPassword: 'Réinitialiser le mot de passe',
        resetLinkExpired: 'Le lien de réinitialisation de votre mot de passe a expiré ou est invalide. Veuillez essayer de nouveau.',
        pleaseCreateNewPassword: 'Veuillez créer un nouveau mot de passe (6 à 12 caractères) pour accéder à votre compte.',
        newPassword: 'Nouveau mot de passe',
        confirmPassword: 'Confirmer le nouveau mot de passe',
        continue: 'Réinitialiser le mot de passe',
        stillHavingTrouble: 'Vous avez toujours des difficultés?',
        unableToResetPassword: 'Si vous ne parvenez pas à réinitialiser votre mot de passe, veuillez appeler le Service à la clientèle au',
        phoneNumber: '(1-877-737-4672)',
        TTY: 'ATS',
        forAssistance: 'Surdité et déficience auditive/ATS voir',
        accessibility: 'Accessibilité',
        confirmError: 'Les mots de passe saisis ne correspondent pas. Veuillez corriger pour continuer',
        resetSuccessful: 'Réinitialisation réussie',
        passwordHasBeenReset: 'Votre mot de passe a été réinitialisé et vous recevrez bientôt un courriel de confirmation.',
        viewProfile: 'OK',
        skipForNow: 'Sauter pour l’instant',
        resetYourPassword: 'Réinitialiser votre mot de passe',
        changePassword: 'Modifier le mot de passe',
        continueAnyway: 'Continuer quand même'
    };
    return resources[label];
}
