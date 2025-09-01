export default function getResource(label, vars = []) {
    const resources = {
        beautyTraits: 'Atouts beauté',
        beautyTraitsInclude: 'Les traits de beauté sur votre profil comprennent :',
        beautyPreferences: 'Préférences beauté',
        beautyPreferencesInclude: 'Les préférences beauté sur votre profil comprennent :',
        skinType: 'Type de peau',
        skinTone: 'Teint',
        hairType: 'Type de cheveux',
        hairColor: 'Colorant capillaire',
        eyeColor: 'Couleur des yeux',
        colorIQ: 'Couleur Qi',
        beautyTraitsVisible: 'Qui peut voir les atouts beauté sur votre profil :',
        beautyPreferencesVisible: 'Les préférences beauté de votre profil sont visibles par :',
        everyone: 'Tout le monde',
        justMe: 'Juste moi',
        profile: 'Profil',
        yourProfileVisibleMe: 'Votre profil est visible pour : Juste moi',
        yourProfileVisibleEveryone: 'Votre profil est visible pour : Tout le monde',
        yourSkincareConcerns: 'Vos préoccupations liées à votre peau et à vos cheveux n’apparaissent pas sur votre profil public.',
        yourBeautyInsider: 'Vos pages Beauty Insider, Listes et Compte sont toujours privées.',
        forMoreInformation: 'Pour plus d’informations, consulter nos',
        termsOfUse: 'conditions d’utilisation de Sephora'
    };
    return resources[label];
}
