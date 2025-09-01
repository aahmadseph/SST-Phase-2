const resources = {
    allRightReserved: 'Sephora USA, Inc. All rights reserved.',
    termsOfUse: 'Terms of Use',
    privacyPolicy: 'Privacy Policy',
    findAStore: 'Find a Store',
    chat: 'Customer Service Chat',
    getTheApp: 'Get the App',
    textApp: 'Download Now',
    regionAndLanguage: 'Region & Language',
    downloadApp: 'Download the Sephora App',
    siteMap: 'Sitemap',
    accessibility: 'Accessibility',
    iOSBanner: 'Download the Sephora App | Download on the App Store > for iOS',
    googlePlayBanner: 'Download the Sephora App | Get it on Google Play > for Android',
    belong: 'you belong to something beautiful.',
    weBelong: 'We Belong to',
    somethingBeautiful: 'Something Beautiful',
    yourPrivacyChoices: 'Your Privacy Choices',
    yourPrivacyChoicesCanada: 'Cookie Preferences',
    websiteFeedback: 'Website feedback? Let us know ▸',
    employeeFeedback: 'Employees: Experiencing issues? Let us know ▸',
    textAlertsTitle: 'Get Sephora Texts',
    textAlertsSubtitle: 'Sign up Now',
    error: 'Error',
    ok: 'OK',
    alreadyLoggedIn: 'You are already logged in. To complete your account setup, please log out and click on the link in your email again.'
};

export default function getResource(label) {
    return resources[label];
}
