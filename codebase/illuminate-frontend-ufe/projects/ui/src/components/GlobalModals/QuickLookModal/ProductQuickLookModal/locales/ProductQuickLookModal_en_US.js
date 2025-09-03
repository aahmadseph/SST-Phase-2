const resources = {
    seeProductDetails: 'See product details',
    appExclusive: 'Download or open the Sephora app to purchase.',
    notRated: 'Not rated',
    oneReview: '1 review',
    reviews: ' reviews',
    productPreview: 'Product preview',
    viewDetails: 'View Details',
    nextProduct: 'Next product',
    prevProduct: 'Previous Product',
    seeFullDetails: 'See Full Details'
};

export default function getResource(label) {
    return resources[label];
}
