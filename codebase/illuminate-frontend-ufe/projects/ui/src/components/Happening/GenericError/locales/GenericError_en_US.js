export default function getResource(label) {
    const resources = {
        header: 'Sorry! There appears to be an issue.',
        p1: 'We\'re sorry, but it seems like we\'re experience a little technical issue. Our team of beauty tech wizards is on the case, working their magic to fix things up and get you back to your shopping spree.',
        p2: 'Can\'t wait any longer? No worries! Visit our stores or try our mobile app for an equally enchanting shopping experience.',
        cta: 'Find A Store Nearby'
    };

    return resources[label];
}
