export default function getResource(label, vars = []) {
    const resources = {
        editProfile: 'Edit Profile',
        profileCategories: {
            photosbio: 'Photos & Bio',
            beautypreferences: 'Beauty Preferences',
            beautypreferencesprivacysettings: 'Beauty Preferences Privacy Settings'
        }
    };
    return resources[label];
}
