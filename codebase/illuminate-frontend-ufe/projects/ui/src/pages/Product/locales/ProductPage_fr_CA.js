export default function getResource(label, vars = []) {
    const resources = {
        digitalProductRewardsSubTitle: 'Échangez 2500 points contre une Récompense Rouge de 100 $',
        productNotFound: 'Produit non trouvé',
        subtitle: `Échangez ${vars[0]} points contre ${vars[1]} Récompense Rouge`,
        details: 'Détails',
        similar: 'Similaire',
        questions: 'Questions et réponses',
        reviews: 'Commentaires',
        top: 'Haut'
    };
    return resources[label];
}
