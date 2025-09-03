export default function getResource(label, vars = []) {
    const resources = {
        reviewfor: `Commentaire pour ${vars[0]}`,
        imagesTitle: 'Images de ce commentaire',
        verifiedPurchase: 'Achat vérifié',
        recommended: 'Recommandé',
        readMore: 'En lire plus',
        readLess: 'En lire moins'
    };
    return resources[label];
}
