module.exports = function getResource(label, vars=[]) {
    const resources = {
        viewDetails: 'View Details',
        viewOptions: 'View all available options',
        regPrice: ' Reg. price',
        selectSaleItems: 'Select sale items',
        finalSale: '*Final Sale:* No Returns or Exchanges',
        size: 'Size'
    };

    return resources[label];
};
