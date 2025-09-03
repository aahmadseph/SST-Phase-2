export default function getResource(label) {
    const resources = {
        ccProgramName: 'Sephora Credit Card Program',
        backLink: 'Back',
        submitButton: 'Submit Application'
    };

    return resources[label];
}
