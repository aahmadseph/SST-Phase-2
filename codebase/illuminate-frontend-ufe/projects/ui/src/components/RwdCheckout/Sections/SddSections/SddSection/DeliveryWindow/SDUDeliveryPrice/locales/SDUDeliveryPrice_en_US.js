export default function getResource(label) {
    const resources = {
        sduMemberFeeUS: 'As a Same-Day unlimited member, you save $6.95 on Same-Day Delivery fees.',
        sduMemberFeeCA: 'As a Same-Day unlimited member, you save $9.95 on Same-Day Delivery fees.',
        sduScheduledFeeUS: 'Same-Day Delivery scheduled fee is $9.95.',
        sduScheduledFeeCA: 'Same-Day Delivery scheduled fee is $12.95.'
    };

    return resources[label];
}
