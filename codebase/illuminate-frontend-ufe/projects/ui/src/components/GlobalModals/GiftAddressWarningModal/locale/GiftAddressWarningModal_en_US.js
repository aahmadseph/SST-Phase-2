export default function getResource(label, vars = []) {
    const resources = {
        title: 'Gift Address Warning',
        buttonText: 'Yes, Place Order',
        cancelButtonText: 'No, Edit Addresses',
        warningMessage1: 'Your gift card and items will be shipped to different addresses.',
        warningMessage2: `${vars[0]} will receive shipment and delivery confirmation emails, and a copy of your gift message, for`,
        both: 'both',
        warningMessage3: 'the gift card shipment and the item shipment.',
        warningMessage4: 'Are you sure this is correct?'
    };

    return resources[label];
}
