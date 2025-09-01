const resources = {
    invoiceNoLongerAvailable: 'Cette facture n’est plus disponible.',
    contactInfo: 'Pour obtenir de l’aide, veuillez communiquer avec le service à la clientèle au 1-877-SEPHORA (1-877-737-4672).',
    homePage: 'Aller à la Page d’accueil Sephora'
};

export default function getResource(label) {
    return resources[label];
}
