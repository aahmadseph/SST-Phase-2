export default function getResource(label) {
    const resources = {
        freeReturns: 'Retours gratuits',
        subHeader: 'Retournez des articles GRATUITEMENT',
        canadaText: 'Tout article neuf ou légèrement utilisé peut être retourné en personne à n’importe quel magasin Sephora au Canada ou par la poste avec notre étiquette de retour prépayée. Aucuns frais de manutention ou d’expédition de retour ne s’appliquent. Les commandes Achetez en ligne, ramassez en magasin et Instacart ne peuvent être retournées qu’en magasin. Les cartes-cadeaux et les appareils intimes ne peuvent être retournés.',
        gotIt: 'Compris',
        learnMore: 'En savoir plus'
    };

    return resources[label];
}
