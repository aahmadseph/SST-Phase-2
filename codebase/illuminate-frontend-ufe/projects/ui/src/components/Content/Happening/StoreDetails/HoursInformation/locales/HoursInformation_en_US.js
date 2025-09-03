export default function getResource(label, vars = []) {
    const resources = {
        storeHours: 'Store Hours',
        storeClosed: 'Store Closed',
        openUntil: `Open until ${vars[0]} today`,
        tempClosed: 'Store Temporarily Closed',
        tempUnavailable: 'Temporarily Unavailable',
        curbsideHours: 'Curbside Hours',
        availableUntil: `Available until ${vars[0]} today`,
        unavailable: 'Unavailable',
        specialCurbsideHours: 'Special Curbside Hours',
        specialStoreHours: 'Special Store Hours',
        available: 'Available',
        specialOpenUntil: `Open until ${vars[0]}`,
        kohlMessage: 'Immerse yourself in the Sephora experience as you shop the bestselling brands in makeup, skincare, hair, and fragrance.\n\nMost Sephora promotions, including Beauty Insider points, rewards, and birthday gifts, are available at Sephora at Kohl’s stores.'
    };

    return resources[label];
}
