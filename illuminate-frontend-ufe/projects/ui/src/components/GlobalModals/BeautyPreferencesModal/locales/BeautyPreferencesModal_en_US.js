export default function getResource(label, vars = []) {
    const resources = {
        modalTitle: 'Add Your Beauty Preferences',
        skipThisQuestion: 'Skip this question',
        next: 'Next',
        done: 'Done',
        modalSubTitle1: 'Congratulations! You are now a Beauty Insider.',
        modalSubTitle2: 'Answer two quick questions for a more personalized shopping experience.',
        apiErrorModalTitle: 'Changes Not Saved',
        apiErrorModalMessage: 'Oops, something went wrong while trying to process your submission. Please try again.',
        buttonText: 'Got It',
        savedTitle: 'Beauty Preferences Saved',
        savedMessage1: `Looking good, ${vars[0]}! You can go to`,
        savedMessage2: ' to edit your answers or tell us more to unlock Personalized Picks.',
        savedMessage3: 'Happy shopping!',
        linkText: 'Beauty Preferences',
        keepGoing: 'Keep Going!'
    };

    return resources[label];
}
