export default function getResource(label, vars = []) {
    const resources = {
        cancel: 'Cancel',
        searchKeyword: 'Search reviews by keyword',
        sort: 'Sort',
        star: 'Star',
        shade: 'Shade',
        colorADADescription: 'Choosing a color will automatically update the reviews that are displayed to match the selected color. To remove the filter, click the x next the filter or click clear all to remove all filters',
        filtersADADescription: 'Selecting a filter below will automatically update the list of reviews that are displayed to match the selected filter(s). Multiple filters can be selected at the same time.  To remove a filter, click the x next to the selected filter or click clear all to remove all filters',
        sortByADADescription: 'Choosing a sort by option will automatically update the reviews that are displayed to match the selected sorting option',
        title: 'Your Beauty Matches',
        saveTraits: 'It looks like you don’t have saved Beauty Traits.',
        experience: 'For the best experience please add the following traits: ',
        experienceValues: 'Skin Tone, Skin Concern, Skin Type, Hair Type, Hair Color, Hair Concern, Eye Color.',
        addTraits: 'Add Traits',
        clearAll: 'Clear all',
        beautyPreferences: 'Your Beauty Preferences'
    };
    return resources[label];
}
