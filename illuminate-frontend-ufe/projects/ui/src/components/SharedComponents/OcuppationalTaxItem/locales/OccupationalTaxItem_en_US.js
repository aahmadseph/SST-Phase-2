export default function getResource(label, vars = []) {
    const resources = {
        default: '',
        pifFee: 'Fees',
        southEEAfee: 'SouthPoint EEA Tax',
        franchiseFee: 'Franchise Tax',
        occupationalTaxInfoModalTitle: 'Occupational Tax',
        tbdText: 'TBD',
        gstHstText: 'Estimated GST/HST'
    };

    return resources[label];
}
