export default function getResource(label, vars = []) {
    const resources = {
        signUp: 'Inscrivez-moi aux alertes par texto de Sephora',
        mobile: 'Numéro de téléphone cellulaire',
        continueBtn: 'Continuer',
        emptyError: 'Veuillez saisir un numéro de téléphone cellulaire.',
        invalidError: 'Veuillez saisir un numéro de téléphone cellulaire valable.'
    };

    return resources[label];
}
