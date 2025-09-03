export default function getResource(label) {
    const resources = {
        errorMessage: 'Difficulté à se connecter à Paze. Veuillez utiliser un autre mode de paiement ou réessayer plus tard.',
        legalNotice: 'En cliquant sur « Continuer vers Paze », je demande à Sephora d’envoyer mes renseignements de commande et de facturation à Paze et je comprends que ces renseignements seront assujettis ',
        pazeTerms: 'aux conditions de Paze',
        legalNotice02: ' et à la ',
        pazePolicy: 'politique de confidentialité de Paze.'
    };

    return resources[label];
}
