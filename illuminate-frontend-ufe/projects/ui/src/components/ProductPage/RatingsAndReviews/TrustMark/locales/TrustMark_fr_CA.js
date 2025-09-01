module.exports = function getResource(label) {
    const resources = {
        // Ratings & Reviews guidelines
        legalMessage: '*Certaines personnes ont reçu quelque chose en échange de cette évaluation (essentiel gratuit, paiement, participation à une promotion).',
        modalTitle: 'Évaluations authentiques',
        modalBody: 'Ces évaluations sont gérées par Bazaarvoice et sont conformes à la politique d’authenticité de Bazaarvoice, qui est soutenue par une technologie antifraude et une analyse humaine. Apprenez-en plus sur la',
        modalLink: 'politique d’authenticité de Bazaarvoice.',
        openModalLabel: 'Ouvrir les modalités des évaluations authentiques'
    };
    return resources[label];
};
