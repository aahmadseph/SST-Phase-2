export default function getResource(label, vars = []) {
    const resources = {
        done: 'Done',
        close: 'Close',
        cancel: 'Cancel',
        continue: 'Continue',
        sephoraCreditCard: 'Sephora Credit Card',
        noThanks: 'No Thanks',
        acceptNow: 'Yes, I\'m Interested',
        notMe: 'Not Me',
        congratulations: 'Congratulations,',
        fromTheRewardsBazaar: 'From the Rewards Bazaar',
        droppingTimeText: 'We’re dropping new rewards every Tuesday and Thursday 9am - 5pm PT. They go fast, so check back often to score one-of-a-kind experiences, personalized services and coveted sample rewards.',
        oops: 'Oops',
        cannotExtendText: 'We could not extend your session. Please try again later.',
        youEntered: 'You entered:',
        recommended: 'Recommended:',
        useTheAddress: 'Use the address I entered',
        extendSessionTitle: 'Extend session?',
        extendSessionButton: 'Extend session',
        sessionExpireText: `Your session will expire in ${vars[0]} min and ${vars[1]} sec due to inactivity.`
    };

    return resources[label];
}
