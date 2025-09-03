export default function getResource(label, vars = []) {
    const resources = {
        modalTitle: 'Réinitialiser le mot de passe',
        resetPasswordMessage: 'Pour réinitialiser votre mot de passe, veuillez saisir votre adresse de courriel ci-dessous. Nous vous enverrons un courriel contenant un lien qui vous permettra de réinitialiser votre mot de passe.',
        emailLabel: 'Adresse de courriel',
        sendEmailButton: 'Envoyer un courriel',
        stillHavingTroublesMsg: 'Vous avez toujours des difficultés?',
        unableResetPasswordMessage: 'Si vous ne parvenez pas à réinitialiser votre mot de passe, veuillez appeler le Service à la clientèle au',
        sephoraPhoneNumber: '1-877-SEPHORA',
        phoneNumberTTY: '(1-877-737-4672)',
        phoneNumber: '1-888-866-9845',
        forAssistanceMessage: 'Surdité et déficience auditive/ATS voir',
        accessibility: 'Accessibilité',
        resetPassword: 'Réinitialiser le mot de passe',
        confirmationMessage: 'Nous avons envoyé un courriel à',
        confirmationMessage2: 'Veuillez vérifier votre boîte de réception et cliquer sur le lien pour réinitialiser votre mot de passe.',
        confirmButton: 'OK',
        fallbackErrorMsg: 'Si vous ne parvenez pas à réinitialiser votre mot de passe, veuillez appeler le service à la clientèle pour obtenir de l’aide.'
    };

    return resources[label];
}
