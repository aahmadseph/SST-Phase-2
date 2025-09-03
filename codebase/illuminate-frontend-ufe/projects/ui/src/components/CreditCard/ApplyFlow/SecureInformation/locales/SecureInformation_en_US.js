export default function getResource(label) {
    const resources = {
        socialSecurityInfoText: 'We ask for you Social Security number to help us identify you. When you submit your application online, we’ll encrypt your details to keep your information safe.',
        secureInfoTitle: '3. Secure Information',
        dateOfBirth: 'Date of Birth',
        socialSecurityNumberLabel: 'Last 4 of Social Security Number',
        annualIncomeLabel: 'Annual Income (e.g. $45,000)',
        alimonyText: 'Alimony, child support, or separate maintenance income need not to be included if you do not wish to have it considered as a basis for repaying this obligation.',
        marriedText: '*Married WI Residents only:* If you are applying for an individual account and your spouse is also a WI resident, combine your and your spouse’s financial information.'
    };

    return resources[label];
}
