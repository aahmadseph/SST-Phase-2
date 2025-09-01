export default function getResource(label, vars = []) {
    const resources = {
        bannerButton: 'Sign up for Sephora Texts',
        bannerTitle: 'Sign up for Sephora Texts',
        bannerParagraph: 'Stay in the loop on exclusive deals, product drops, and more.',
        bannerRates: '*Msg & data rates may apply.'
    };

    return resources[label];
}
