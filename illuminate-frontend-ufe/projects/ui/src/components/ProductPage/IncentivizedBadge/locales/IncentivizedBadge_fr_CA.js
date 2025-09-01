const resources = {
    badge: 'Incité',
    tooltip: 'Le créateur du contenu a reçu quelque chose en échange de cette publication (produit gratuit, paiement, participation à une promotion)'
};

export default function getResource(label) {
    return resources[label];
}
