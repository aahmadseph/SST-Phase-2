const resources = {
    signInHeading: 'Recevez vos offres exclusives Beauty Insider',
    signInText: 'Ouvrez une session pour voir s’il y a des offres qui vous attendent.',
    signInButton: 'Ouvrir une session',
    registerButton: 'Créer un compte',
    noPromosHeading: 'Nous travaillons sur de nouvelles offres pour vous',
    noPromosText: 'Entre-temps, jetez un coup d’œil à nos autres offres ci-dessous.'
};

export default function getResource(label) {
    return resources[label];
}
