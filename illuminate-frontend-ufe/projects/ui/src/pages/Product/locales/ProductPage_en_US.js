export default function getResource(label, vars = []) {
    const resources = {
        digitalProductRewardsSubTitle: 'Exchange 2500 points for $100 Rouge Reward',
        productNotFound: 'Product not found',
        subtitle: `Exchange ${vars[0]} points for ${vars[1]} Rouge Reward`,
        details: 'Details',
        similar: 'Similar',
        questions: 'Q&A',
        reviews: 'Reviews',
        top: 'Top'
    };
    return resources[label];
}
