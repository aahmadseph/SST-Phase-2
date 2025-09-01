export default function getResource(label, vars = []) {
    const resources = {
        editProfile: 'Modifier le profil',
        profileCategories: {
            photosbio: 'Photos et description',
            beautypreferences: 'Préférences beauté',
            beautypreferencesprivacysettings: 'Paramètres de confidentialité des préférences beauté'
        }
    };
    return resources[label];
}
