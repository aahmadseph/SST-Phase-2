const resources = {
    representative: 'Live representatives are available:',
    monFriTime: '5am - 9pm PT',
    satSunTime: '6am - 9pm PT',
    monFri: 'MON-FRI',
    satSun: 'SAT-SUN',
    chatWithUs: 'Chat with Us'
};

export default function getResource(label) {
    return resources[label];
}
