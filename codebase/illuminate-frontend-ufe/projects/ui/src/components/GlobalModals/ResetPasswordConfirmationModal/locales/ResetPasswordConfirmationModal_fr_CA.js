const resources = {
    emailSent: 'Courriel envoyé',
    confirmationMessage: 'Nous avons envoyé un courriel à',
    confirmationMessage2: 'Veuillez vérifier votre boîte de réception et cliquer sur le lien pour réinitialiser votre mot de passe.',
    confirmButton: 'OK',
    didntGetEmail: 'Vous n’avez pas reçu le courriel? Vérifiez votre dossier de pourriels ou',
    resend: 'envoyez le courriel à nouveau',
    error: 'Erreur',
    errorMessage: 'Un problème est survenu et nous ne pouvons pas renvoyer le courriel. Veuillez réessayer plus tard.'
};

export default function getResource(label, vars = []) {
    return resources[label];
}
