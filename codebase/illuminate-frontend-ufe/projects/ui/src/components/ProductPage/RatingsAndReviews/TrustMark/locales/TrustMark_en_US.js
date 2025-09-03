module.exports = function getResource(label) {
    const resources = {
        // Ratings & Reviews guidelines
        legalMessage: '*Some reviewers received something in exchange for a review (free product, payment, sweeps entry).',
        modalTitle: 'Authentic Reviews',
        modalBody: 'These reviews are managed by Bazaarvoice and comply with the Bazaarvoice Authenticity Policy, which is supported by anti-fraud technology and human analysis. Learn more about the',
        modalLink: 'Bazaarvoice Authenticity Policy.',
        openModalLabel: 'Open Authentic Reviews Modal'
    };
    return resources[label];
};
