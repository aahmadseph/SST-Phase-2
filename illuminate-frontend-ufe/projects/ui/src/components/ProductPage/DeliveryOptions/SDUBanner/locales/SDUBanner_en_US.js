export default function getResource(label) {
    const resources = {
        getFreeSameDayDelivery: 'Get FREE Same-Day Delivery',
        youGetFreeSameDayDelivery: 'You Get FREE Same-Day Delivery!',
        signUp: 'Sign Up',
        yourBasketContains: 'Your basket contains a',
        learnMore: 'Learn More',
        startSavingWithSephora: 'Start saving with Sephora',
        sameDayUnlimited: 'Same-Day Unlimited',
        startSavingWithA: 'Start saving with a',
        ofSameDayUnlimited: 'of Same-Day Unlimited.',
        ofSephoraSDU: 'of Sephora Same-Day Unlimited.',
        subscription: 'subscription.',
        free: 'FREE',
        dayTrial: '-day trial ',
        tryNowForFree: 'Try Now For Free'
    };

    return resources[label];
}
