export default function getResource(label, vars = []) {
    const resources = {
        free: 'FREE',
        edit: 'Edit',
        eyes: 'Eyes',
        eyebrows: 'Eyebrows',
        complexion: 'Complexion',
        cheeks: 'Cheeks',
        lips: 'Lips',
        selectOneFeature: 'Choose one feature to focus on:',
        optional: '(Optional)',
        anySpecialRequests: 'Any special requests?',
        shareYourIdeas: 'Share your ideas, favorite brands, and/or products. You can always change your mind on the day of your appointment.'
    };

    return resources[label];
}
