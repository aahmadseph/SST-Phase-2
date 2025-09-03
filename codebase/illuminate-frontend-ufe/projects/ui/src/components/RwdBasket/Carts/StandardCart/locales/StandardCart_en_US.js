
export default function getResource(label, vars = []) {
    const resources = {
        getItShippedTitle: `Get It Shipped (${vars[0]})`,
        getItSooner: 'Get It Sooner',
        fulfillmentMsg: 'This item is not available for other fulfillment options.',
        freeGift: 'Free Gift',
        item: `ITEM ${vars[0]}`,
        freeSample: 'Free Sample',
        freePDPSample: 'Free Product Sample'
    };

    return resources[label];
}
