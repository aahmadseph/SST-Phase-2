export default function getResource(label, vars = []) {
    const resources = {
        ssdRougeTestV2InfoModalTitle: 'Rouge Free Same-Day Delivery',
        ssdRougeTestV2InfoModalMsg1: `To use this Rouge benefit, your Same-Day Delivery items must total $${vars[0]}+ before tax, after discounts and promotions have been applied.`,
        ssdRougeTestV2InfoModalMsg2: 'Want FREE Same-Day Delivery on any order? Sign up for',
        ssdRougeTestV2InfoModalMsgLink: 'Same-Day Unlimited',
        ssdRougeTestV2InfoModalMsg3: 'today.',
        ssdRougeTestV2InfoModalMsgButton: 'Got It'
    };

    return resources[label];
}
