export default function getResource(label, vars=[]) {
    const resources = {
        bopisTitle: `Buy Online and Pick Up (${vars[0]})`,
        shippingTitle: `Shipping and Delivery Basket (${vars[0]})`,
        basketSwitchBOPIS: 'View your Buy Online and Pick Up Basket',
        basketSwitchShipping: 'View your Shipping and Delivery Basket',
        sddRougePromoBannerTitle: 'Want your items today? ',
        sddRougePromoBannerMessage: `Rouge members can try Free Same-Day Delivery on $${vars[0]}+ orders! Check availability by tapping the "Get It Sooner" button.`
    };

    return resources[label];
}
