import Empty from 'constants/empty';

const beautyPreferencesSelector = store => store.beautyPreferences || Empty.Object;

export default { beautyPreferencesSelector };
