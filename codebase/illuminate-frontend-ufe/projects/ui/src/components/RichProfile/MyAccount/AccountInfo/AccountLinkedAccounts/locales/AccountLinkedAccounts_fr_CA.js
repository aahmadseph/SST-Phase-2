export default function getResource(label, vars = []) {
    const resources = {
        linkedAccounts: 'Comptes liés',
        unlink: 'Dissocier',
        linkedOn: 'Lié à',
        unlinkAccount: 'Dissocier le compte',
        cancel: 'Annuler',
        areYouSure: `Êtes-vous sûr de vouloir dissocier votre compte Sephora de ${vars[0]}?`,
        unlinkSuccess: `Votre compte Sephora a été dissocié de ${vars[0]}.`,
        done: 'Terminé',
        faq: 'FAQ',
        unlinkError: `Nous sommes désolés. Une erreur s’est produite lors de la dissociation de votre compte. Veuillez réessayer ou communiquer avec Sephora par ${vars[0]} ou par téléphone au ${vars[1]}.`,
        editButton: 'Modifier',
        chat: 'Clavardage'
    };
    return resources[label];
}
