export default function getResource(label, vars = []) {
    const resources = {
        sectionTitle: '5. Electronic Consent',
        electronicConsentTextWithCardType: `By signing or otherwise submitting this application /solicitation, each applicant (“I”, “me” or “my” below) agrees and certifies that (1) I have read and agree to the disclosures provided on or with this application /solicitation, (2) the information I have supplied is true and correct, (3) I am applying to Comenity Capital Bank, P.O. Box 183003, Columbus, OH 43218-3003 (“Bank”) for a Sephora ${vars[0]} Credit Card account, (4) I authorize the Bank to obtain credit reports on me, (5) if approved, my account will be governed by the Credit Card Agreement, (6) I understand that I may pay all of my account balance at any time without penalty and (7) this application/solicitation, any information I submit to the Bank, and the Bank’s final decision on my application/solicitation may be shared with and retained by Sephora.`,
        electronicConsentText: 'By signing or otherwise submitting this application/solicitation, each applicant (“I”, “me” or “my” below) agrees and certifies that (1) I have read and agree to the disclosures provided on or with this application/solicitation, (2) the information I have supplied is true and correct, (3) I am applying to Comenity Capital Bank, P.O. Box 183003, Columbus, OH 43218-3003 (“Bank”) for either a Sephora Visa Credit Card account or Sephora Credit Card account, and the Bank will decide which account, if any, to offer me, (4) I authorize the Bank to obtain credit reports on me, (5) if approved, my account will be governed by the Credit Card Agreement, (6) I understand that I may pay all of my account balance at any time without penalty and (7) this application/solicitation, any information I submit to the Bank, and the Bank’s final decision on my application/solicitation may be shared with and retained by Sephora.',
        mustReadText: `You must read the disclosures presented in the Electronic Consent section of the Terms and Conditions boxes below prior to checking the consent box. Please also read the Credit Card Agreement, Privacy Statement and other information presented in the Terms and Conditions box prior to submitting this application and ${vars[0]} for your records.`,
        printCopy: 'print a copy',
        checkboxCopyText: 'I understand that by checking this box and clicking “Submit Application,” I agree to the Terms and Conditions, acknowledge receipt of the Privacy Notice, consent to electronically receive documents, and electronically sign this application/solicitation.',
        consetToAccountTermsAndConditions: 'Consent to Account Terms & Conditions',
        consentToFinancialTermsOfTheAccount: 'Consent to Financial Terms of the Account',
        openDisclosureIn: 'Open disclosures in',
        newTab: 'new tab'
    };

    return resources[label];
}
