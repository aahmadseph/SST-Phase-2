export default function getResource(label, vars = []) {
    const resources = {
        color: 'Color',
        readMore: 'Read more',
        thumbnailADAAltText: 'User generated image',
        recommendsProduct: 'Recommended',
        showMore: 'Show more',
        negativeFeedbackButtonLabel: `Not Helpful (${vars[0]})`,
        positiveFeedbackButtonLabel: `Helpful (${vars[0]})`,
        verifiedPurchase: 'Verified Purchase',
        sephoraEmployee: 'Sephora Employee',
        receivedFreeProduct: 'Received free product for review'
    };
    return resources[label];
}
