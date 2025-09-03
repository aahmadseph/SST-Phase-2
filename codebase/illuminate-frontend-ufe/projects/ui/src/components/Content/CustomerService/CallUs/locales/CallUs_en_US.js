const resources = {
    callUs: 'Call Us',
    phone: '1-877-SEPHORA (1-877-737-4672)',
    phoneLocation: '(U.S. or Canada)',
    hearingImpaired: 'Deaf and Hard-of-Hearing/TTY',
    seeAccessibility: 'see Accessibility',
    rougePrivate: 'Rouge Private Hotline',
    rougePhone: '1-855-55-ROUGE',
    rougePhoneFull: '(1-855-557-6843)',
    representative: 'Representatives are available:',
    monFri: 'MON-FRI',
    monFriTime: '5am - 9pm PT',
    satSun: 'SAT-SUN',
    satSunTime: '6am - 9pm PT'
};

export default function getResource(label) {
    return resources[label];
}
