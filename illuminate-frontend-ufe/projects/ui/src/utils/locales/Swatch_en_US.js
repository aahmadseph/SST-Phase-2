export default function getResource(label, vars = []) {
    const resources = {
        SALE_GROUP_NAME: 'Sale',
        SIZE_REFINEMENT_LABEL: ' size',
        FINISH_REFINEMENT_LABEL: ' finish',
        STANDARD_REFINEMENT_LABEL: 'Standard',
        COLOR_REFINEMENT_LABEL: 'color',
        NO_REFINEMENT_LABEL: 'no refinement'
    };
    return resources[label];
}
