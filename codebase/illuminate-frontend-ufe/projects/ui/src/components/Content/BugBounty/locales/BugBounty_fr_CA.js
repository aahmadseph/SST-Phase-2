export default function getResource(label) {
    const resources = {
        submitVulnerabilityReport: 'Soumettre le rapport sur la vulnérabilité',
        mobileNotOptimalExperienceWarning: 'Le formulaire de soumission n’est pas encore optimisé pour les appareils mobiles. Veuillez utiliser un navigateur de bureau pour accéder au formulaire et soumettre votre rapport.'
    };

    return resources[label];
}
