export default function getResource(label, vars = []) {
    const resources = {
        colorIQDesc1: 'Utilisez notre ',
        shadeFinder: 'Explorateur de teinte',
        colorIQDesc2: ` pour identifier votre teinte pour chaque fond de teint et anticernes. Ou rendez-vous dans un [magasin Sephora|${vars[0]}] et demandez un balayage du ton de la peau Color IQ.`
    };
    return resources[label];
}
