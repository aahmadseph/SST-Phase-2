export default function getResource(label, vars = []) {
    const resources = {
        modalTitle: 'Veuillez ouvrir une session Sephora',
        beautyInsiderAlt: 'Beauty Insider'
    };

    return resources[label];
}
