export default function getResource(label, vars = []) {
    const resources = {
        default: '',
        pifFee: 'Frais',
        southEEAfee: 'Taxe SouthPointe EEA',
        franchiseFee: 'Taxe de franchise',
        occupationalTaxInfoModalTitle: 'Taxe professionnelle',
        tbdText: 'À déterminer',
        gstHstText: 'TPS/TVH estimées'
    };

    return resources[label];
}
