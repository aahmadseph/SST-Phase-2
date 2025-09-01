export default function getResource(label, vars = []) {
    const resources = {
        shopNow: 'Shop Now',
        signIn: 'Sign In',
        createAccount: 'Create Account',
        joinNow: 'Join Now',
        errorCampaignHasntStarted: 'Sorry, the promotion you entered has not started.',
        errorCampaignExpired: 'Sorry, the promotion you entered has expired.',
        errorMaxCount1: 'Sorry, this link has reached its maximum redemption limit.',
        errorMaxCount2: 'Please reach out to the person who sent you the link.',
        errorInvalidCampaign: 'This promotion does not exist.',
        errorInvalidCountry: 'This promotion is not available for this country.',
        errorRefereeAlreadyRegisteredLine1: 'You have already signed up for your 20% off!',
        errorRefereeAlreadyRegisteredLine2: 'Check your email for details.',
        errorRefereeMaxCountReachedLine1: 'Sorry, this link has already been redeemed by another friend.',
        errorRefereeMaxCountReachedLine2: 'Please reach out to the person who sent you the link.',
        selfRegistrationNotAllowedLine1: 'Oops, you cannot redeem your own link.',
        selfRegistrationNotAllowedLine2: 'Please copy and paste this link and share with a friend.',
        errorAlreadyBI: 'This promotion is not available to existing Beauty Insider members.',
        errorAdvocacyDown: 'Oops! The service is temporarily unavailable.',
        errorBiDown: 'Beauty Insider is temporarily unavailable.',
        errorGenericDescription: 'We’re working on getting it back online. Please try again later. In the meantime, explore our site for inspiration.',
        valid: 'Valid',
        yourPurchase: 'your purchase'
    };

    return resources[label];
}
