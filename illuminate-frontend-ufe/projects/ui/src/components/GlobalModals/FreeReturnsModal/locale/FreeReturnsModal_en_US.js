export default function getResource(label) {
    const resources = {
        freeReturns: 'Free Returns',
        subHeader: 'Return Products for FREE',
        canadaText: 'New or gently used products can be returned in person to any Sephora Canada store or by mail with our pre-paid return shipping label. No return shipping or handling fees apply. Buy Online, Pick Up In Store and Instacart orders can only be returned in store. Gift cards and intimate devices are not eligible for returns.',
        gotIt: 'Got It',
        learnMore: 'Learn More'
    };

    return resources[label];
}
