export default function getResource(label, vars = []) {
    const resources = {
        close: 'Close',
        shopNow: 'Shop Now Pay Later',
        klarnaTitle: 'Buy now. Pay with Klarna at your own pace.',
        klarnaDescription: 'Get what you love, choose how you pay.',
        klarnaInstructions: 'At checkout select Klarna | Choose your payment plan | Complete your checkout | The amount will be charged based on the payment plan you chose',
        klarnaTerms: 'A higher initial payment may be required for some consumers. CA residents: Loans made or arranged pursuant to a California Financing Law license. See payment',
        klarnaTermsLink: 'terms',
        afterpayTitle: 'Shop now. Choose how you pay.',
        afterpayDescription: '',
        afterpayUSInstructions: 'Shop now. Pay in 4. Always interest-free.| Add your favorites to basket|  Select Cash App Afterpay at Checkout| Log into or create your Cash App Afterpay account, instant approval decision| Your purchase will be split into 4 payments, payable every 2 weeks.',
        afterpayInstructions: 'Add your favorites to basket | Select Afterpay at Checkout|  Choose to pay monthly or in 4 interest-free payments.* | Get the flexibility you need when you pay over time.',
        afterpayTerms: 'You must be 18 or older, a resident of the U.S., and meet additional eligibility criteria to qualify. Late fees may apply.',
        afterpayTerms2: 'Estimated payment amounts shown on product pages exclude taxes and shipping charges, which are added at checkout.',
        afterpayTerms3: 'for complete terms.',
        afterpayTerms4: 'Loans to California residents made or arranged pursuant to a California Finance Lenders Law license.',
        afterpayTerms5: '@2022 Afterpay US',
        afterpayTermsLink: 'Click here',
        paypalTitle: 'Pay in 4 interest-free payments.',
        paypalDescription: '',
        paypalInstructions: 'Choose PayPal at checkout to pay later with *Pay in 4* | Complete your purchase with a 25% down payment | Use autopay for the rest of your bi-weekly payments. It\'\s easy!',
        paypalTerms: 'Pay in 4 is available to consumers upon approval for purchases of $30 to $1,500. Pay in 4 is currently not available to residents of MO or NV. Offer availability depends on the merchant and also may not be available for certain recurring, subscription services. When applying, a soft credit check may be needed, but will not affect your credit score. You must be 18 years old or older to apply. PayPal, Inc.: Loans to CA residents are made or arranged pursuant to a CA Financing Law License. GA Installment Lender Licensee, NMLS #910457. RI Small Loan Lender Licensee. NM residents:',
        paypalTerms2: 'related to Pay in 4.',
        paypalTermsLink: 'Find more disclosures',
        paypalSubtitle: `Split your purchase of ${vars[0]} into 4 payments of ${vars[1]} every two weeks, with no impact on credit score and no late fees.`,
        learnMore: 'Learn more',
        gotIt: 'Got It'
    };

    return resources[label];
}
