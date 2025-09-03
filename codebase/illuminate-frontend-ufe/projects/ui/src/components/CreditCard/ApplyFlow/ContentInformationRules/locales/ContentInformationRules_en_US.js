export default function getResource(label) {
    const resources = {
        nonPreapprovedIssuer: 'Comenity Capital Bank is the issuer of the Sephora Visa Credit Card and the Sephora Credit Card. The Sephora Credit Card may only be used at Sephora stores (excluding Puerto Rico and Canada). If you wish to proceed with this online application, you will be providing your personal information to Comenity Capital Bank.',
        nonPreapprovedReview: 'While your application for the Sephora Visa Credit Card is reviewed, if you do not qualify for the Sephora Visa Credit Card, you may be considered for and receive the Sephora Credit Card, to be used only at Sephora (excluding Puerto Rico and Canada locations). Before submitting your application, please review rates, fees and costs for both credit cards.',
        nonPreapprovedConditional: '*To apply you must:* Be at the age of majority in your state or territory, have a valid government-issued photo ID, have a valid government issued tax identification number (such as a SSN or SIN) and have a street, rural route, or APO/FPO mailing address. We do not accept PO Box mailing addresses.',
        privateLabelIssuer: 'Comenity Capital Bank is the issuer of the Sephora Credit Card. The Sephora Credit Card may only be used at Sephora stores (excluding Puerto Rico and Canada). If you wish to proceed with this acceptance form below, you will be providing your personal information to Comenity Capital Bank.',
        privateLabelConditional: '*To accept you must:* Be at the age of majority in your state or territory, have a valid government-issued photo ID, have a valid government issued tax identification number (such as a SSN or SIN) and have a street, rural route, or APO/FPO mailing address. We do not accept PO Box mailing addresses.',
        coBrandedIssuer: 'Comenity Capital Bank is the issuer of the Sephora Visa Credit Card. If you wish to proceed with this acceptance form below, you will be providing your personal information to Comenity Capital Bank.',
        coBrandedConditional: '*To accept you must:* Be at the age of majority in your state or territory, have a valid government-issued photo ID, have a valid government issued tax identification number (such as a SSN or SIN) and have a street, rural route, or APO/FPO mailing address. We do not accept PO Box mailing addresses.',
        contentInfoAndRulesTitle: '1. Content Information & Rules'
    };

    return resources[label];
}
