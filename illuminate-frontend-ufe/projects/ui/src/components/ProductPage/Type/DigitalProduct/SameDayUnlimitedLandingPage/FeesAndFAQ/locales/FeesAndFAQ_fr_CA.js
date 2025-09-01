export default function getResource(label) {
    const resources = {
        plusApplicableTaxes: 'Plus les taxes applicables',
        feesMayApply: 'Des frais peuvent s’appliquer aux commandes avec période de livraison planifiée',
        needHelp: 'Besoin d’aide?',
        viewFaqs: 'Voir la FAQ'
    };

    return resources[label];
}
