export default function getResource(label, vars = []) {
    const resources = {
        SALE_GROUP_NAME: 'Solde',
        SIZE_REFINEMENT_LABEL: ' format',
        FINISH_REFINEMENT_LABEL: ' fini',
        STANDARD_REFINEMENT_LABEL: 'Standard',
        COLOR_REFINEMENT_LABEL: 'couleur',
        NO_REFINEMENT_LABEL: 'aucun raffinement'
    };
    return resources[label];
}
