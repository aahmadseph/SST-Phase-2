export default function getResource(label, vars = []) {
    const resources = {
        biAccountRequiredText: 'A Beauty Insider account is required to apply for the Sephora Credit Card.',
        birthdayForAutoEnrolledMessage: 'Add your birthday below to receive a free gift during your birthday month—it’s just one of the many perks of Beauty Insider.',
        birthdayForNotAutoEnrolledMessage: 'Sign up for our free rewards program to earn points with every purchase, a gift on your birthday, one-of-a-kind experiences, services, and samples.',
        enterBirthdayForGiftText: 'Enter your birthday to receive a free gift every year.',
        pointText: 'point',
        pointsText: 'points',
        signupAndEarnText: `Sign up and earn *${vars[0]} ${vars[1]}* from today’s order`,
        joinAndAgree: 'Join and agree to ',
        termsAndConditionsLink: 'Terms & Conditions',
        biTermsAndConditionsLink: 'Beauty Insider Terms & Conditions',
        joinCheckboxLabel: 'Yes, join Sephora’s free rewards program and earn points on every purchase.',
        byUncheckingMessage: 'By unchecking the box above, you are registering for Sephora.com only.',
        byJoiningText: 'By joining you agree to our',
        automaticEmailOffersText: ' and you will automatically receive Beauty Insider offers via email',
        enterBirthdayText: 'Enter your birthday to receive a free gift every year.',
        testEnterBirthdayText: 'Enter your birthday to receive your birthday gift annually.'
    };
    return resources[label];
}
