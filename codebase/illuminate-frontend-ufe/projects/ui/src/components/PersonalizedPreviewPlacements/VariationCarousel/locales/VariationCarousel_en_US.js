export default function getResource(label) {
    const resources = {
        startEndDates: 'Start Date and End Date',
        viewRule: 'View Rule',
        reset: 'Reset',
        componentInfo: 'Component Info',
        performanceAndRules: 'Performance & Rules',
        showInfo: 'Show Info',
        globalContentGuardrails: 'Global Content Guardrails',
        mlActivated: 'ML-Activated'
    };

    return resources[label];
}
