export default function getResource(label, vars = []) {
    const resources = {
        title: 'Beauty Insider Benefits',
        signIn: 'Sign in',
        signInSubText: 'to see your points and redeem rewards.',
        applyText: 'Apply',
        noBiPoints: `You now have <b>${vars[0]}</b> Beauty Insider points.`,
        biPoints: `You currently have <b>${vars[0]} points</b>`,
        cxsMissingMessage: 'Beauty Insider is temporarily unavailable. Please check back later.',
        exceededCheckoutPoints: `You are exceeding by ${vars[0]} points. Please remove the BI cash to continue to checkout.`,
        joinNow: 'Join now',
        joinNowSubText: 'to save your points and redeem rewards.',
        rougeBadge: 'ROUGE EXCLUSIVE'
    };

    return resources[label];
}
