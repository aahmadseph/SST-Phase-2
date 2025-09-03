const resources = {
    firstNameLabel: 'First Name',
    lastNameLabel: 'Last Name',
    productAsSampleLabel: 'I received this product as a free sample',
    noteLabel: 'Note',
    reviewLabel: 'Review',
    yesLabel: 'Yes',
    noLabel: 'No',
    sephoraEmployeeLabel: 'I am a Sephora employee',
    nextLabel: 'Next',
    submitErrorLabel: 'Submission Error',
    thankYouLabel: 'Thank You',
    addPromoLabel: 'Add Promo',
    seeMoreLabel: 'See more',
    shopNowLabel: 'Shop now',
    videoLabel: 'Video',
    sorrySomethingWrongLabel: 'We’re sorry, something went wrong. Please try again.'
};

export default function getResource(label) {
    return resources[label];
}
