module.exports = function getResource(label, vars = []) {
    const resources = {
        sephoraSDUTitle: 'Sephora Same-Day Unlimited',
        gotIt: 'Got It',
        cancelSubscription: 'Cancel Subscription',
        wellMissYou: 'We’ll miss you!',
        cancelSubscriptionMsg: 'If you cancel now, you can still use your active subscription until ',
        cancelTrialMsgStart: 'If you cancel now, you will lose your benefits immediately and pay ',
        cancelTrialMsgEnd: 'on Same-day delivery orders.',
        nevermind: 'Never Mind',
        subscriptionCanceled: 'Your subscription has been successfully canceled.',
        ok: 'Ok',
        errorMessage: 'Your order is processing. You may make changes to your subscription after your current order has processed. Typically in a few hours.',
        errorModalTitle: 'Unable to Make Changes'
    };
    return resources[label];
};
