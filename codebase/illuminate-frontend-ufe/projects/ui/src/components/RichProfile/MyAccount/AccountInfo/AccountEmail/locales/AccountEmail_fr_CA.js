export default function getResource(label, vars = []) {
    const resources = {
        email: 'Adresse courriel',
        edit: 'Modifier',
        confirmEmailLabel: 'Confirmer l’adresse courriel',
        cancel: 'Annuler',
        update: 'Mise à jour',
        emptyEmailMessage: 'Veuillez remplir ce champ.',
        invalidConfirmationMessage: 'L’adresse courriel saisie ne correspond pas. Veuillez corriger pour continuer.',
        invalidEmailMessage: 'Veuillez saisir une adresse courriel au format nomutilisateur@domaine.com.',
        invalidEmailError: 'Type d’adresse courriel non valide. Veuillez entrer une adresse courriel valide'
    };
    return resources[label];
}
