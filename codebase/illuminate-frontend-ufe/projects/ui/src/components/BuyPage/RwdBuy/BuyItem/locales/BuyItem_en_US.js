export default function getResource(label) {
    const resources = {
        size: 'Size',
        item: 'ITEM',
        moreColors: 'more colors',
        review: 'Review',
        buyNow: 'Buy Now',
        less: 'less',
        more: 'more'
    };

    return resources[label];
}
