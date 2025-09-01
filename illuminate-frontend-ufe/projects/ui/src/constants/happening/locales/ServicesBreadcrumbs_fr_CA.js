export default function getResource(label, vars = []) {
    const resources = {
        beautyServices: 'FAQ sur les Services Beauté',
        happeningAtSephora: 'En cours chez Sephora',
        servicesAndEvents: 'Services et événements',
        makeupServices: 'Services de maquillage'
    };

    return resources[label];
}
