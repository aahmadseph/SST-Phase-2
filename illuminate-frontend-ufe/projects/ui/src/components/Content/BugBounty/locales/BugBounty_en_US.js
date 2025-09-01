export default function getResource(label) {
    const resources = {
        submitVulnerabilityReport: 'Submit Vulnerability Report',
        mobileNotOptimalExperienceWarning: 'The submission form is not yet optimized for mobile. Please use a desktop browser to access the form and submit your report.'
    };

    return resources[label];
}
