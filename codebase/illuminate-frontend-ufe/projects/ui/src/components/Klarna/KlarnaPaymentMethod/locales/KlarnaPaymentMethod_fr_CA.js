export default function getResource(label, vars = []) {
    const resources = {
        myBillingAddrIsTheSame: 'Mon adresse de facturation est la même que mon adresse d’expédition',
        iframeError: 'Difficulté à se connecter à Klarna. Veuillez utiliser un autre mode de paiement ou réessayer plus tard.',
        legalNotice: 'En cliquant sur « Continuer vers Klarna », je demande à Sephora d’envoyer mes renseignements de commande et de facturation à Karna et je comprends que ces renseignements seront assujettis aux conditions Karna et à sa politique de confidentialité.'
    };

    return resources[label];
}
