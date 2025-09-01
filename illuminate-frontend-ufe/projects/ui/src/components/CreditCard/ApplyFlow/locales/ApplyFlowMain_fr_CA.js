export default function getResource(label) {
    const resources = {
        ccProgramName: 'Programme de carte de crédit Sephora',
        backLink: 'Retour',
        submitButton: 'Soumettre la demande'
    };

    return resources[label];
}
