export default function getResource(label, vars = []) {
    const resources = {
        beautyTraits: 'Beauty Traits',
        beautyTraitsInclude: 'Beauty Traits on your profile include:',
        beautyPreferences: 'Beauty Preferences',
        beautyPreferencesInclude: 'Beauty Preferences on your profile include:',
        skinType: 'Skin type',
        skinTone: 'Skin tone',
        hairType: 'Hair type',
        hairColor: 'Hair color',
        eyeColor: 'Eye color',
        colorIQ: 'Color IQ',
        beautyTraitsVisible: 'Beauty Traits on your profile are visible to:',
        beautyPreferencesVisible: 'Beauty Preferences on your profile are visible to:',
        everyone: 'Everyone',
        justMe: 'Just me',
        profile: 'Profile',
        yourProfileVisibleMe: 'Your Profile is visible to: Just me',
        yourProfileVisibleEveryone: 'Your Profile is visible to: Everyone',
        yourSkincareConcerns: 'Your skincare concerns and hair concerns are not shown on your public profile.',
        yourBeautyInsider: 'Your Beauty Insider, Lists and Account pages are always private.',
        forMoreInformation: 'For more information, see our',
        termsOfUse: 'Terms of Use'
    };
    return resources[label];
}
