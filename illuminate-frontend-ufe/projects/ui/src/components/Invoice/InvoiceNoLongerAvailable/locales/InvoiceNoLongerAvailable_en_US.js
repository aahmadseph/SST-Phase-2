const resources = {
    invoiceNoLongerAvailable: 'This invoice is no longer available.',
    contactInfo: 'For help, please contact Client Services at 1-877-SEPHORA (1-877-737-4672)',
    homePage: 'Go to Sephora Home Page'
};

export default function getResource(label) {
    return resources[label];
}
