export default function getResource(label, vars = []) {
    const resources = {
        seeFullDetails: 'See full product details',
        chooseOptions: 'Choose Options',
        size: `Size ${vars[0]}`,
        appExclusive: 'Download or open the Sephora app to purchase.',
        close: 'Close'
    };

    return resources[label];
}
