const resources = {
    new: 'New',
    value: 'value',
    colors: 'Colors',
    color: 'Color',
    quickLook: 'Quicklook',
    sponsored: 'Sponsored',
    regPrice: ' Reg. price',
    selectSaleItems: 'Select sale items',
    viewSimilarProducts: 'View similar products',
    purchased: 'PURCHASED',
    buyItAgain: 'BUY IT AGAIN'
};

export default function getResource(label) {
    return resources[label];
}
