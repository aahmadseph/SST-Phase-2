const PROMOTIONAL_EMAILS_PREFS_COUNTRIES = [
    ['US', 'United States'],
    ['CA', 'Canada'],
    ['PR', 'Puerto Rico']
];

const PromotionalEmailsPrefsFrequency = {
    DAILY: 'DAILY',
    WEEKLY: 'WEEKLY',
    MONTHLY: 'MONTHLY'
};

const EmailSubscriptionTypes = {
    CONSUMER: 'CONSUMER',
    TRIGGERED: 'TRIGGERED',
    MAIL: 'MAIL'
};

const SubscriptionStatus = {
    SUBSCRIBED: 'SUBSCRIBED',
    UNSUBSCRIBED: 'UNSUBSCRIBED'
};

const SAVED_BANNER_TIMEOUT = 3000;

export default {
    PROMOTIONAL_EMAILS_PREFS_COUNTRIES,
    PromotionalEmailsPrefsFrequency,
    EmailSubscriptionTypes,
    SubscriptionStatus,
    SAVED_BANNER_TIMEOUT
};
