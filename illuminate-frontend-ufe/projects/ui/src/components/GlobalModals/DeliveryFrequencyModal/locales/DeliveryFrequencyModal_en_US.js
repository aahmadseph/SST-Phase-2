export default function getResource(label, vars = []) {
    const resources = {
        chooseDeliveryFreq: 'Deliver Every:',
        mostCommon: 'Most Common',
        youWillSave: 'you will save',
        annualyWithSubs: 'annually with this subscription.',
        save: 'Save',
        cancel: 'Cancel',
        frequencyNumber: 'Frequency Number',
        frequencyType: 'Frequency Type',
        item: 'ITEM',
        actualPrice: 'Actual Price',
        originalPrice: 'Original Price',
        months: 'Month(s)',
        legalCopy1: 'off your first',
        legalCopy2: 'deliveries.',
        legalCopy3: 'See product for details.',
        firstYearSavings: 'in your first year with this subscription.',
        lastDeliveryLeft: `delivery left at ${vars[0]}% off`,
        deliveriesLeft: `deliveries left at ${vars[0]}% off`,
        discountValidUntil: `Discount valid until ${vars[0]}`,
        discountsValidUntil: `Discounts valid until ${vars[0]}`
    };

    return resources[label];
}
