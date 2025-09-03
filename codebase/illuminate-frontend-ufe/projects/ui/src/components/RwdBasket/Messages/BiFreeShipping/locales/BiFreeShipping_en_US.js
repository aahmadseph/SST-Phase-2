export default function getResource(label, vars=[]) {
    const resources = {
        biFreeShip: `Beauty Insiders enjoy ${vars[0]} on all orders.`,
        freeShipQualifies: `You now qualify for ${vars[0]}.`,
        biFreeShipVar: 'FREE Standard Shipping',
        biFreeShipPointsVar: `Get *FREE Shipping* and at least *${vars[0]} points* on this order.`
    };

    return resources[label];
}
