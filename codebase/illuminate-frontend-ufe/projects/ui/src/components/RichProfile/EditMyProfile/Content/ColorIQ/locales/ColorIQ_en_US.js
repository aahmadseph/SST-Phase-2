export default function getResource(label, vars = []) {
    const resources = {
        addedErrorMessage: 'This ColorIQ has already been added',
        defaultErrorMessage: 'Invalid Color IQ',
        defaultSkintone: 'Default Skintone',
        capturedOn: 'Captured on',
        tryShadeFinder: 'Try Shade Finder',
        youCanUseOur: 'You can use our ',
        shadeFinder: 'Shade Finder',
        toFindProducts: '  to find matching products based on your current foundation shade.',
        findYourShade: 'Find Your Shade',
        or: 'Or',
        getYourSkinScan: 'Get Your Skin Scan',
        pleaseComeToOur: 'Please come to our ',
        sephoraStore: 'Sephora store',
        toGetYourSkinScan: ' to get your skin scan and get your perfect color match!',
        bookAnAppointment: 'Book an Appointment'
    };

    return resources[label];
}
