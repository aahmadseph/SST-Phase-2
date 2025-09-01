export default function getResource(label, vars = []) {
    const resources = {
        tooltipText: 'Beauty Preferences allows you to save your traits (like skin and hair type) and shopping preferences, so you can easily filter products and personalize your site experience.',
        moreInfo: 'More info'
    };
    return resources[label];
}
