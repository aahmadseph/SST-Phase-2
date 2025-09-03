export default function getResource(label, vars = []) {
    const resources = {
        review: 'Review',
        rateHeading: 'Rate this product',
        writeReview: 'Write your review',
        writeReviewExample: 'Example: After using this product over the past few weeks, I am loving the results! It has helped keep my dry skin feeling hydrated. Application is easy, and the formula is...',
        rateAndReview: 'Rate & Review',
        headline: 'Headline',
        headlineExample: 'Example: A must-have in my routine!',
        optional: 'optional',
        addAHeadline: 'Add a headline',
        maxChar: `Max. ${vars[0]} characters`,
        seeFull: 'See full',
        addPhoto: 'Add photo',
        upToTwoImages: 'up to two images',
        wouldYouRecommendThisProduct: 'Would you recommend this product?',
        yes: 'Yes',
        no: 'No',
        productAsAfreeSample: 'I received something in exchange for this post (free product, payment, sweeps entry)',
        sephoraEmployee: 'I am a Sephora employee',
        next: 'Next',
        errorMessageText: `Review must be at least ${vars[0]} characters`,
        errorMessageRating: 'Please select a star rating',
        errorMessageTextRecommend: 'Please select one',
        termsAndConditions: 'Terms of Use',
        termsError: 'You must agree to our Terms of Use to continue',
        yesAgree: 'Yes, I agree to the'
    };
    return resources[label];
}
