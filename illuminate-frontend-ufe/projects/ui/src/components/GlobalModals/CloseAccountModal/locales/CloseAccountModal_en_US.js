export default function getResource(label) {
    const resources = {
        title: 'Close Account',
        checkboxText: 'I understand that I am losing the above perks of being a Beauty Insider',
        cancelButton: 'Cancel',
        listTitleText: 'Please note that, once you close your Sephora account, the following benefits will be immediately affected:',
        item1: '1. You will no longer be able to log into your account, and Beauty Advisors will not be able to check your account in Sephora stores.',
        item2: '2. You will forfeit all of your existing BI points, tier status, and tier benefits.',
        item3: '3. You will no longer accrue BI points on purchases (even if using a Sephora Credit Card).',
        item4: '4. You will lose access to your Community account, including the ability to post product reviews, upload photos, participate in Forums/Groups, or answer any product Q&As.',
        item5: '5. You will be opted out of all Sephora Marketing, including emails, SMS, and push notifications. (Please expect up to 12 hours for this to take effect.)',
        item6: '6. Any account linked to your Sephora account (Kohls, Doordash, Instacart, Facebook, Shipt) will be unlinked.',
        item7: '7. If you have Auto-Replenish items, any shipment that has not shipped will be canceled and the Auto-Replenish enrollment will end.',
        item8: '8. If you have subscribed to the Same-Day Unlimited service, your subscription will end without any refund and the annual renewal will be canceled.',
        postListText: 'Closing your Sephora account will not affect open orders, returns, and Paid Service appointments. In addition, if you have the Sephora Credit Card, you will be able to continue to use the credit card and check balances on the bank’s website, and you will continue to receive bank rewards for qualifying purchases.'
    };
    return resources[label];
}

