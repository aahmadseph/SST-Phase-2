export default function getResource(label) {
    const resources = {
        yourNextPurchase: 'Your Next Purchase',
        redemptionInstructions: 'Redemption Instructions',
        barcodeScan: 'Or scan the barcode below in store to redeem',
        shopNow: 'Shop Now',
        redeemOnline: 'To redeem online, use code',
        valid: 'Valid'
    };

    return resources[label];
}
