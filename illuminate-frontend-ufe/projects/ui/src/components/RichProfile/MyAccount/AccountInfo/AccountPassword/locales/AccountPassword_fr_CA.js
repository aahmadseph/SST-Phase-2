export default function getResource(label, vars = []) {
    const resources = {
        password: 'Mot de passe',
        edit: 'Modifier',
        confirmPasswordLabel: 'Confirmer le mot de passe',
        cancel: 'Annuler',
        update: 'Mise à jour',
        errorMessagePassword: 'Veuillez remplir ce champ.',
        errorShortPassword: `Veuillez saisir un mot de passe comprenant entre ${vars[0]} et ${vars[1]} caractères (pas d’espace).`,
        errorConfirmPassord: 'Les mots de passe saisis ne correspondent pas. Veuillez corriger pour continuer.',
        passwordLabel: `Mot de passe (${vars[0]} à ${vars[1]} caractères)`
    };
    return resources[label];
}
