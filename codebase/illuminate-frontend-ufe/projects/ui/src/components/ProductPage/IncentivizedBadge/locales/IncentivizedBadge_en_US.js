const resources = {
    badge: 'Incentivized',
    tooltip: 'The content creator received something in exchange for this post (free product, payment, sweeps entry)'
};

export default function getResource(label) {
    return resources[label];
}
