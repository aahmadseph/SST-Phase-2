export default function getResource(label, vars=[]) {
    const resources = {
        size: 'Size',
        color: 'Color',
        finalSale: '*Final Sale:* No Returns or Exchanges'
    };

    return resources[label];
}
