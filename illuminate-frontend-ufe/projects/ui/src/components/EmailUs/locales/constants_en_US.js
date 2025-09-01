export default function getResource(label, vars = []) {
    const resources = {
        orderInfo: 'Order Information',
        productInfo: 'Product Information',
        beautyInsider: 'Beauty Insider',
        passwordReset: 'Password Reset',
        askBeautyAdviser: 'Ask a Beauty Adviser',
        retailStoreInfo: 'Retail Store Information',
        websiteFeedback: 'Website Feedback',
        complimentComplaint: 'Compliment or Complaint',
        general: 'General Feedback or Question',
        ratingsReviews: 'Ratings and Reviews'
    };

    return resources[label];
}
