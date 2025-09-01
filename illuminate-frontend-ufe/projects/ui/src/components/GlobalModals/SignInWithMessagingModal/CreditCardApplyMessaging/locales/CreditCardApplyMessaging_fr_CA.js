export default function getResource(label, vars = []) {
    const resources = {
        dontHaveAccountMessage: 'Pas de compte?',
        registerWithSephoraMessage: 'Inscrivez-vous sur Sephora.com pour faire une demande de carte de crédit Sephora et vous inscrire à Beauty Insider, notre programme de fidélisation gratuit.',
        registerApplyButton: 'Inscrivez-vous et appliquez maintenant'
    };

    return resources[label];
}
