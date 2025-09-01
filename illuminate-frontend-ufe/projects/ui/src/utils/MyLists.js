import localeUtils from 'utils/LanguageLocale';
import HelperUtils from 'utils/Helpers';

function isSharableListEnabled() {
    const country = localeUtils.getCurrentCountry();
    const killSwitchConfig = Sephora.configurationSettings?.sharableLists ?? {};

    return killSwitchConfig && killSwitchConfig[`sharableLists${country}`]?.isEnabled === true;
}

function isPerfImprovementEnabled() {
    const killSwitchConfig = Sephora.configurationSettings?.sharableLists ?? {};

    return killSwitchConfig && killSwitchConfig.perfImprovement === true;
}

function savedInListsText({
    listNames, visibleCount = 3, maxNameLength = 20, savedIn, and
}) {
    if (!listNames || listNames.length === 0) {
        return '';
    }

    const truncatedListNames = listNames.slice(0, visibleCount).map(listName =>
        HelperUtils.truncateGraphemes({
            text: listName.replace(/\n/g, ' '),
            maxTextLength: maxNameLength,
            truncationMarker: '...'
        })
    );

    if (truncatedListNames.length === 1) {
        return `${savedIn} ${truncatedListNames[0]}`;
    }

    if (truncatedListNames.length === 2) {
        return `${savedIn} ${truncatedListNames[0]} ${and} ${truncatedListNames[1]}`;
    }

    if (listNames.length === 3) {
        return `${savedIn} ${truncatedListNames[0]}, ${truncatedListNames[1]}, ${and} ${truncatedListNames[2]}`;
    }

    let result = `${savedIn} ${truncatedListNames.join(', ')}`;

    const remainingCount = listNames.length - truncatedListNames.length;

    if (remainingCount > 0) {
        result += `, ${and} +${remainingCount}`;
    }

    return result;
}

export default {
    isSharableListEnabled,
    savedInListsText,
    isPerfImprovementEnabled
};
