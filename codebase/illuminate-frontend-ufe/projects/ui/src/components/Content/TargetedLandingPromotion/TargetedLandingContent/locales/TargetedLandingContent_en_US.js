export default function getResource(label) {
    const resources = {
        redemptionInstructions: 'Redemption Instructions:',
        redeemOnline: 'To redeem online, use code ',
        scanInStoreToRedeem: 'Or scan the barcode below in store to redeem',
        shopNow: 'Shop Now',
        valid: 'Valid'
    };

    return resources[label];
}
