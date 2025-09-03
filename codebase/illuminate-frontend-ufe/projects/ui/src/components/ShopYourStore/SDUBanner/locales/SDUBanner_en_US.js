export default function getResource(label) {
    const resources = {
        getFreeSameDayDelivery: 'Get FREE Same-Day Delivery',
        tryNowForFree: 'Try Now For Free',
        startSaving: 'Start saving with a *FREE 30-day trial* of Sephora Same-Day Unlimited.'
    };

    return resources[label];
}
