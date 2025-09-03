export default function getResource(label, vars = []) {
    const resources = {
        reviewfor: `Review For ${vars[0]}`,
        imagesTitle: 'Images from this review',
        verifiedPurchase: 'Verified Purchase',
        recommended: 'Recommended',
        readMore: 'Read more',
        readLess: 'Read less'
    };
    return resources[label];
}
