export default function getResource(label) {
    const resources = {
        startEndDates: 'Date de début et date de fin',
        viewRule: 'Afficher la règle',
        reset: 'Réinitialiser',
        componentInfo: 'Information sur les composants',
        performanceAndRules: 'Rendement et règlements',
        showInfo: 'Afficher l’information',
        globalContentGuardrails: 'Directives de contenu global',
        mlActivated: 'ML-Activated'
    };

    return resources[label];
}
