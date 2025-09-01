
export default function getResource(label, vars = []) {
    const resources = {
        getItShippedTitle: `Faites livrer (${vars[0]})`,
        getItSooner: 'Obtenez-le plus rapidement',
        fulfillmentMsg: 'Cet article n’est pas disponible pour d’autres options d’exécution.',
        freeGift: 'Cadeau gratuit',
        item: `ARTICLE ${vars[0]}`,
        freeSample: 'Échantillon gratuit',
        freePDPSample: 'Échantillon d’essentiel gratuit'
    };

    return resources[label];
}
