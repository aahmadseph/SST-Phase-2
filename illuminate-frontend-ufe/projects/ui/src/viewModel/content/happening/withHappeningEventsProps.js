import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import FrameworkUtils from 'utils/framework';
import HappeningActions from 'actions/HappeningActions';
import AppliedEventsFiltersSelector from 'selectors/page/servicesAndEvents/events/appliedEventsFiltersSelector';
import IsLoadingSelector from 'selectors/page/servicesAndEvents/events/isLoadingSelector';
import StoresListSelector from 'selectors/page/servicesAndEvents/events/storesListSelector';
import CurrentLocationSelector from 'selectors/page/servicesAndEvents/events/currentLocationSelector';

const { wrapHOC } = FrameworkUtils;
const { storesListSelector } = StoresListSelector;
const { isLoadingSelector } = IsLoadingSelector;
const { currentLocationSelector } = CurrentLocationSelector;
const { appliedEventsFiltersSelector } = AppliedEventsFiltersSelector;
const { getFilteredEvents, showLocationAndStores, setStoresList, resetFiltersToDefault } = HappeningActions;

const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Content/Happening/HappeningEvents/locales', 'HappeningEvents');

const fields = createSelector(
    appliedEventsFiltersSelector,
    isLoadingSelector,
    storesListSelector,
    currentLocationSelector,
    createStructuredSelector({
        showMoreEvents: getTextFromResource(getText, 'showMoreEvents'),
        tryChangeFilters: getTextFromResource(getText, 'tryChangeFilters'),
        of: getTextFromResource(getText, 'of'),
        results: getTextFromResource(getText, 'results'),
        sortBy: getTextFromResource(getText, 'sortBy'),
        adjustFilters: getTextFromResource(getText, 'adjustFilters'),
        noEventsMessage: getTextFromResource(getText, 'noEventsMessage'),
        changeLocation: getTextFromResource(getText, 'changeLocation')
    }),
    (appliedFilters, isLoading, storesList, currentLocation, localization) => {
        return {
            localization,
            appliedFilters,
            isLoading,
            storesList,
            currentLocation
        };
    }
);

const functions = {
    getFilteredEvents,
    showLocationAndStores,
    setStoresList,
    resetFiltersToDefault
};

const withHappeningEventsProps = wrapHOC(connect(fields, functions));

export { withHappeningEventsProps };
