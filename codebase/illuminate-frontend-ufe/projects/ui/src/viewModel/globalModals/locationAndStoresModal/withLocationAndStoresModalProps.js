import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import HappeningActions from 'actions/HappeningActions';
import AppliedEventsFiltersSelector from 'selectors/page/servicesAndEvents/events/appliedEventsFiltersSelector';
import StoresListSelector from 'selectors/page/servicesAndEvents/events/storesListSelector';
import CurrentLocationSelector from 'selectors/page/servicesAndEvents/events/currentLocationSelector';

const { wrapHOC } = FrameworkUtils;
const { storesListSelector } = StoresListSelector;
const { currentLocationSelector } = CurrentLocationSelector;
const { appliedEventsFiltersSelector } = AppliedEventsFiltersSelector;
const {
    getFilteredEvents, showLocationAndStores, closeLocationAndStores, setStoresList, setCurrentLocation
} = HappeningActions;

const fields = createSelector(
    appliedEventsFiltersSelector,
    storesListSelector,
    currentLocationSelector,
    (appliedFilters, storesList, currentLocation) => {
        return {
            appliedFilters,
            storesList,
            currentLocation
        };
    }
);

const functions = {
    getFilteredEvents,
    showLocationAndStores,
    closeLocationAndStores,
    setStoresList,
    setCurrentLocation
};

const withLocationAndStoresModal = wrapHOC(connect(fields, functions));

export { withLocationAndStoresModal };
