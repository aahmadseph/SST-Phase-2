const resources = {
    firstName: 'First Name',
    lastName: 'Last Name',
    emailAddress: 'Email Address',
    subject: 'Subject',
    biIdOptional: 'Beauty Insider ID (optional)',
    orderNumberOptional: 'Order number (optional)',
    enterComment: 'Enter comment (1000 characters max)',
    commentRequired: 'Comment is required.',
    personalInfoConfidential: 'All personal information is strictly confidential.',
    sendEmail: 'Send Email',
    thankYou: 'Thank you for contacting Sephora',
    inTouchSoon: 'A representative will be in touch with you soon.',
    ok: 'Ok'
};

export default function getResource(label) {
    return resources[label];
}
