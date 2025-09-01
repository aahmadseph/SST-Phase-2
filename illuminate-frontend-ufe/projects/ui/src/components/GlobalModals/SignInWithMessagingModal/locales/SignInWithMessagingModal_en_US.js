export default function getResource(label, vars = []) {
    const resources = {
        modalTitle: 'Please sign in to Sephora',
        termsOfUseLink: 'Terms of Use',
        privacyPolicyLink: 'Privacy Policy',
        wantToSaveYourPoints: `Want to Save Your ${vars[0]} Points?`,
        pointsAndFreeShip: `Sign in to save your *${vars[0]} Beauty Insider points*, get *FREE standard shipping* & redeem your free rewards.`,
        pointsForBooking: `Sign in to receive your *${vars[0]} Beauty Insider points* after service completion.`
    };

    return resources[label];
}
