export default function getResource(label, vars = []) {
    const resources = {
        bpRedesignSubtitle: `Based on your selected ${vars[0]} traits and preferences.`,
        confettiModalTitleOneWorld: ' Nicely Done! Keep Going 🎉',
        confettiModalMessageOneWorld: 'The more preferences you give us, the better your product suggestions will be.',
        confettiModalTitleAllWords: ' All Done! 🎉',
        confettiModalMessageAllWords: 'You\'ve successfully filled out your Beauty Preferences profile—now it\'s time to enjoy your personalized recommendations.',
        confettiModalButton: 'Got It'
    };
    return resources[label];
}
