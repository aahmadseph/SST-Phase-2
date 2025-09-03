export default function getResource(label, vars = []) {
    const resources = {
        nonIncentivized: 'Excluant les évaluations des créateurs de contenu qui ont reçu quelque chose en échange (produit gratuit, paiement, participation à une promotion)',
        moreInfo: 'Plus d’informations, excluant les évaluations des créateurs de contenu qui ont reçu quelque chose en échange (produit gratuit, paiement, participation à une promotion)'
    };
    return resources[label];
}
