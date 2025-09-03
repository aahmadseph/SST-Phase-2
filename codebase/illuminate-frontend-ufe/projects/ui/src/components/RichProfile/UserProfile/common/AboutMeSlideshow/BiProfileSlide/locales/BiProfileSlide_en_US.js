export default function getResource(label, vars = []) {
    const resources = {
        privateEmptyContent: 'Looking for products to help fight frizz? Searching for eye-popping eye shadow? Answer a few short beauty questions to get personalized recommendations.',
        publicEmptyContent: `${vars[0]} has not filled out a beauty profile yet.`,
        skin: 'Skin',
        hair: 'Hair',
        eyes: 'Eyes',
        colorIQ: 'Color IQ'
    };
    return resources[label];
}
