export default function getResource(label, vars=[]) {
    const resources = {
        biFreeShip: `Beauty Insiders enjoy *${vars[0]}* on all orders.`,
        freeShipQualifies: `You now qualify for *${vars[0]}*.`,
        biFreeShipVar: 'FREE standard shipping'
    };

    return resources[label];
}
