export default function getResource(label, vars=[]) {
    const resources = {
        free: 'FREE',
        biFreeShip: 'Beauty Insiders enjoy *FREE standard shipping* on all orders.',
        freeShip: `Your Order qualifies for *${vars[0]}.*`,
        freeShipVar: 'FREE standard shipping',
        biFreeShipShort: 'Beauty Insiders enjoy *FREE standard shipping*',
        tbdText: 'TBD'
    };

    return resources[label];
}
