export default function getResource(label, vars = []) {
    const resources = {
        modalTitleRegister: 'S’inscrire auprès de Sephora',
        modalTitleCreate: 'Créer un compte',
        modalTitleComplete: 'Terminer la configuration du compte'
    };

    return resources[label];
}
