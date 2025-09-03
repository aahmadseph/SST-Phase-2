export default function getResource(label, vars = []) {
    const resources = {
        bannerButton: 'Inscrivez-vous aux alertes par texto de Sephora',
        bannerTitle: 'Inscrivez-vous aux alertes par texto de Sephora',
        bannerParagraph: 'Pour tout savoir sur les aubaines exclusives, les nouveautés et plus encore.',
        bannerRates: '*Des frais de messagerie texte et de données peuvent s’appliquer.'
    };

    return resources[label];
}
