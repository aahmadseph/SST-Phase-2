export default function getResource(label, vars = []) {
    const resources = {
        nonIncentivized: 'Exclude reviews from content creators who received something in exchange (free product, payment, sweeps entry)',
        moreInfo: 'More info, Exclude reviews from content creators who received something in exchange (free product, payment, sweeps entry)'
    };
    return resources[label];
}
