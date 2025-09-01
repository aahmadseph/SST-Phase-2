export default function getResource(label, vars = []) {
    const resources = {
        title: 'Error',
        header: 'Sorry! There appears to be an issue.',
        content: 'We’re sorry, but it seems like we’re experiencing a little technical issue. Our team of beauty tech wizards is on the case, working their magic to fix things up and get you back to your shopping spree. Please try again later.',
        cta: 'Close'
    };

    return resources[label];
}
