export default function getResource(label) {
    const resources = {
        plusApplicableTaxes: 'Plus applicable taxes',
        feesMayApply: 'Fees may apply to Scheduled Delivery window orders',
        needHelp: 'Need Help?',
        viewFaqs: 'View FAQs'
    };

    return resources[label];
}
