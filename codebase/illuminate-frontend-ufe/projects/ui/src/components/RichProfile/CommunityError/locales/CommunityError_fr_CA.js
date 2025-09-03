export default function getResource(label, vars = []) {
    const resources = {
        pageNotCurrentlyAvailable: 'Cette page est actuellement indisponible. Veuillez réessayer plus tard.',
        continueShopping: 'Continuer à magasiner'
    };
    return resources[label];
}
