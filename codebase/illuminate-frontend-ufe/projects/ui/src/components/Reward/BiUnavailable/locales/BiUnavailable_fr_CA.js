export default function getResource(label) {
    const resources = { biUnavailable: 'Les points Beauty Insider ne sont pas disponibles pour le moment. Veuillez réessayer plus tard.' };

    return resources[label];
}
