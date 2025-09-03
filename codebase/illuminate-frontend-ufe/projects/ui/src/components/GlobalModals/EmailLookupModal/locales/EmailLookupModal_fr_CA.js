const resources = {
    title: 'Créer un compte',
    joinBiProgram: 'Joignez-vous au programme de fidélisation Beauty Insider. Accumulez des points, profitez de *l’expédition standard GRATUITE*, échangez des récompenses et plus encore.',
    joinBookingBiProgram: 'Créez un compte Beauty Insider GRATUITEMENT pour gérer vos réservations de service et vos événements.',
    email: 'Adresse de courriel',
    confirmButton: 'Continuer',
    alreadyHaveAccount: 'Vous avez déjà un compte?',
    signIn: 'Ouvrir une session',
    existingUserError: 'Nous sommes désolés. Une erreur se produit avec votre adresse courriel ou votre mot de passe. N’oubliez pas : les mots de passe doivent être composés de 6 à 12 caractères (lettres ou chiffres). Veuillez réessayer ou cliquer sur « Mot de passe oublié ».',
    invalidEmailError: 'Type d’adresse courriel non valide. Veuillez entrer une adresse courriel valide'
};

export default function getResource(label, vars = []) {
    return resources[label];
}
