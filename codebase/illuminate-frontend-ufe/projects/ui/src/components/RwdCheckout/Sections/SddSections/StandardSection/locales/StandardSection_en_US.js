export default function getResource(label, vars) {
    const resources = {
        editLinkText: 'Edit',
        subTitle: 'FREE - Standard Shipping',
        title: 'Shipping',
        autoReplenTitle: 'Shipping'
    };

    return resources[label];
}
