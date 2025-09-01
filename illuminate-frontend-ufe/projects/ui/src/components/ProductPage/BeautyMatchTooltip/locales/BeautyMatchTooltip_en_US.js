const resources = {
    beautyMatchesPopupText: 'A Beauty Match is someone who shares the same beauty traits as you (skin tone or hair concerns, etc.). For the best experience with this feature, please add your info to your',
    beautyMatchesPopupLink: 'Beauty Preferences'
};

export default function getResource(label) {
    return resources[label];
}
