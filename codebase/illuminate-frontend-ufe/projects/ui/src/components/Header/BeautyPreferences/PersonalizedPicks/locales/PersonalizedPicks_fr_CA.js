export default function getResource(label, vars = []) {
    const resources = {
        title: 'Vos choix de produits personnalisés',
        noRecommendationsMessage: 'Complétez vos préférences beauté pour des recommandations qui vous conviennent.',
        withRecommendationsMessage: 'Nous avons sélectionné ces produits en fonction de vos préoccupations en matière de peau et de cheveux. Complétez vos préférences beauté pour obtenir des recommandations plus précises.',
        withRecommendationsTwoMessage: 'Selon vos préférences beauté.'
    };
    return resources[label];
}
