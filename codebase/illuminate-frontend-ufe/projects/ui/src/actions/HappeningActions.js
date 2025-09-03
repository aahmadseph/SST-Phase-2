import actions from 'actions/Actions';

import {
    SET_APPLIED_EVENTS_FILTERS, SET_IS_LOADING, SET_STORES_LIST, SET_CURRENT_LOCATION
} from 'constants/actionTypes/events';
import {
    SET_HAPPENING, SET_HAPPENING_NON_CONTENT, RESET_HAPPENING_IS_INITIALIZED, SET_FILTERED_EVENTS
} from 'constants/actionTypes/happening';
import { Pages } from 'constants/Pages';

import eventsReducer from 'reducers/page/events';
import headerAndFooterReducer from 'reducers/headerAndFooter';

import sdnApi from 'services/api/sdn';
import bookGuestServiceMutation from 'services/api/happening/bookGuestService/bookGuestService';
import getGuestBookingDetailsQuery from 'services/api/happening/getGuestBookingDetails';
import getReservationSensitiveDetails from 'services/api/happening/getReservationSensitiveDetails';

import urlUtils from 'utils/Url';
import locationUtils from 'utils/Location';
import happeningFilters from 'utils/happeningFilters';
import languageLocaleUtils from 'utils/LanguageLocale';
import storeUtils from 'utils/Store';
import isFunction from 'utils/functions/isFunction';
import { getDataForSPANavigation, getRebookingInfo, getUserStatusData } from 'utils/happening';

const { getCurrentCountry, getCurrentLanguage } = languageLocaleUtils;
const { getFiltersQueryString, defaultFilters } = happeningFilters;
const { ACTION_TYPES: TYPES } = eventsReducer;

const {
    getActivitiesContent,
    getActivityEDPContent,
    getUserReservations,
    getServiceBookingDetails,
    getApptConfirmationContent,
    getApptDetailsContent,
    getSeasonalContent,
    getWaitlistBookingContent,
    getWaitlistConfirmationContent,
    getWaitlistReservationContent
} = sdnApi;

const setAppliedEventsFilters = data => ({
    type: SET_APPLIED_EVENTS_FILTERS,
    payload: data
});

const setIsLoading = data => ({
    type: SET_IS_LOADING,
    payload: data
});

const setStoresList = data => ({
    type: SET_STORES_LIST,
    payload: data
});

const setCurrentLocation = data => ({
    type: SET_CURRENT_LOCATION,
    payload: data
});

const setFilteredEventsData = data => ({
    type: SET_FILTERED_EVENTS,
    payload: { data }
});

const setHappeningContent = data => ({
    type: SET_HAPPENING,
    payload: { data }
});

const setHappeningNonContent = data => ({
    type: SET_HAPPENING_NON_CONTENT,
    payload: { data }
});

const resetHappeningIsInitialized = () => ({
    type: RESET_HAPPENING_IS_INITIALIZED
});

const setCompactHeaderAndFooter = data => ({
    type: headerAndFooterReducer.ACTION_TYPES.SET_COMPACT_HEADER_FOOTER,
    payload: { data }
});

const onErrorRedirect = error => {
    if (error?.responseStatus && error.responseStatus === 404 && locationUtils.isEventDetailsPage()) {
        return urlUtils.redirectTo('/happening/events');
    }

    return urlUtils.redirectTo('/happening/error');
};

const isNewPage = () => true;

const openPage = ({ events: { onPageUpdated, onDataLoaded, onError }, newLocation }) => {
    return async (dispatch, getState) => {
        try {
            const { data, actionType } = await getDataForSPANavigation(getState, newLocation, setCompactHeaderAndFooter);

            if (!data) {
                onError(true, { path: Pages.HappeningGenericError }, true);
            } else {
                onDataLoaded(data);
                dispatch({
                    type: actionType,
                    payload: { data }
                });
                onPageUpdated(data);
            }

            return Promise.resolve();
        } catch (error) {
            onError(error, newLocation, true);

            return Promise.reject(error);
        }
    };
};

const getLandingPagesCSC = ({ preferredStoreId, preferredZipCode, sephoraStores, successCallback }) => {
    return dispatch => {
        const country = getCurrentCountry();
        const language = getCurrentLanguage();
        const { activityType } = locationUtils.getHappeningPathActivityInfo();
        const isEventsLandingPage = locationUtils.isEventsLandingPage();

        if (isEventsLandingPage) {
            dispatch(setStoresList(sephoraStores));
            dispatch(setCurrentLocation({ display: preferredZipCode, storeId: preferredStoreId }));
        }

        if (preferredStoreId && preferredZipCode) {
            getActivitiesContent({
                country,
                language,
                activityType,
                storeId: preferredStoreId,
                zipCode: preferredZipCode
            })
                .then(response => {
                    if (response?.data) {
                        dispatch(setHappeningContent(response.data));

                        if (isFunction(successCallback)) {
                            successCallback();
                        }
                    } else {
                        onErrorRedirect();
                    }
                })
                .catch(onErrorRedirect);
        }
    };
};

const getEventEDPCSC = user => {
    return dispatch => {
        const country = getCurrentCountry();
        const language = getCurrentLanguage();
        const storeId = urlUtils.getParamsByName('storeId')?.[0];
        const zipCode = urlUtils.getParamsByName('zipCode')?.[0];
        const { activityType, activityId } = locationUtils.getHappeningPathActivityInfo();

        getActivityEDPContent({
            language,
            country,
            activityType,
            activityId,
            storeId,
            zipCode,
            ...(user.isSignedIn && { email: user.email })
        })
            .then(response => {
                if (response?.data) {
                    dispatch(setHappeningContent(response.data));
                } else {
                    onErrorRedirect(response);
                }
            })
            .catch(onErrorRedirect);
    };
};

const getApptDetailsCSC = () => {
    return dispatch => {
        const country = getCurrentCountry();
        const language = getCurrentLanguage();
        const confirmationNumber = urlUtils.getParamsByName('id')?.[0];
        const zipCode = urlUtils.getParamsByName('zipCode')?.[0];
        const reservationCountry = urlUtils.getParamsByName('country')?.[0];

        getApptDetailsContent({
            country,
            language,
            zipCode,
            confirmationNumber,
            reservationCountry
        })
            .then(response => {
                if (response?.data) {
                    dispatch(setHappeningContent(response.data));
                } else {
                    onErrorRedirect();
                }
            })
            .catch(onErrorRedirect);
    };
};

const getMyReservationsCSC = (status = 'UPCOMING') => {
    return (dispatch, getState) => {
        const country = getCurrentCountry();
        const language = getCurrentLanguage();
        const { isSignedIn, email } = getUserStatusData(getState);

        if (isSignedIn && email) {
            dispatch(actions.showInterstice(true));

            return getUserReservations({ country, language, email, status })
                .then(response => {
                    if (response?.data || response?.responseStatus === 200) {
                        dispatch(
                            setHappeningNonContent({
                                [status]: response.data || []
                            })
                        );
                    } else {
                        onErrorRedirect();
                    }
                })
                .catch(onErrorRedirect)
                .finally(() => dispatch(actions.showInterstice(false)));
        }

        dispatch(setHappeningNonContent({ isDefaultData: true }));

        return Promise.resolve();
    };
};

const getServiceBookingCSC = (storeId, zipCode) => {
    return dispatch => {
        const country = getCurrentCountry();
        const language = getCurrentLanguage();
        const { activityId } = locationUtils.getHappeningPathActivityInfo();
        const { rebookingStoreId, rebookingZipCode } = getRebookingInfo();

        getServiceBookingDetails({
            country,
            language,
            activityId,
            zipCode: rebookingZipCode ? rebookingZipCode : zipCode,
            selectedStoreId: rebookingStoreId ? rebookingStoreId : storeId
        })
            .then(data => {
                dispatch(setHappeningNonContent(data));
            })
            .catch(onErrorRedirect);
    };
};

const getApptConfirmationCSC = zipCode => {
    return dispatch => {
        const country = getCurrentCountry();
        const language = getCurrentLanguage();
        const { activityId, activityType } = locationUtils.getHappeningPathActivityInfo();

        getApptConfirmationContent({
            country,
            language,
            activityType,
            activityId,
            ...(zipCode && { zipCode })
        })
            .then(response => {
                if (response?.data) {
                    dispatch(setHappeningContent(response.data));
                } else {
                    onErrorRedirect();
                }
            })
            .catch(onErrorRedirect);
    };
};

const getWaitlistBookingCSC = () => {
    return (dispatch, getState) => {
        // this page needs COMPACT_HEADER_FOOTER on page load
        dispatch(setCompactHeaderAndFooter(true));

        const { isSignedIn } = getUserStatusData(getState);

        if (isSignedIn) {
            dispatch(actions.showInterstice(true));

            const country = getCurrentCountry();
            const language = getCurrentLanguage();
            const { activityId } = locationUtils.getHappeningPathActivityInfo();

            return getWaitlistBookingContent({
                country,
                language,
                activityId
            })
                .then(data => {
                    if (data) {
                        dispatch(setHappeningNonContent(data));
                    } else {
                        onErrorRedirect();
                    }
                })
                .catch(onErrorRedirect)
                .finally(() => dispatch(actions.showInterstice(false)));
        }

        dispatch(setHappeningNonContent({ isDefaultData: true }));

        return Promise.resolve();
    };
};

const getWaitlistConfirmationCSC = () => {
    return dispatch => {
        const country = getCurrentCountry();
        const language = getCurrentLanguage();
        const { activityId } = locationUtils.getHappeningPathActivityInfo();

        getWaitlistConfirmationContent({
            country,
            language,
            activityId
        })
            .then(response => {
                if (response?.data) {
                    dispatch(setHappeningContent(response.data));
                } else {
                    onErrorRedirect();
                }
            })
            .catch(onErrorRedirect);
    };
};

const getWaitlistReservationCSC = () => {
    return dispatch => {
        const country = getCurrentCountry();
        const language = getCurrentLanguage();
        const { activityId } = locationUtils.getHappeningPathActivityInfo();

        getWaitlistReservationContent({
            country,
            language,
            activityId
        })
            .then(response => {
                if (response?.data) {
                    dispatch(setHappeningContent(response.data));
                } else {
                    onErrorRedirect();
                }
            })
            .catch(onErrorRedirect);
    };
};

const getSeasonalCSC = zipCode => {
    return dispatch => {
        const apiOptions = {
            country: getCurrentCountry(),
            language: getCurrentLanguage(),
            zipCode
        };

        getSeasonalContent(apiOptions)
            .then(response => {
                if (response?.data) {
                    dispatch(setHappeningContent(response.data));
                } else {
                    onErrorRedirect();
                }
            })
            .catch(onErrorRedirect);
    };
};

const getFilteredEvents = ({ appliedFilters, storeId, zipCode, discard }) => {
    return dispatch => {
        const country = getCurrentCountry();
        const language = getCurrentLanguage();
        const { activityType } = locationUtils.getHappeningPathActivityInfo();
        const filters = getFiltersQueryString(appliedFilters);

        dispatch(setIsLoading(true));
        dispatch(resetHappeningIsInitialized());

        getActivitiesContent({
            country,
            language,
            storeId,
            zipCode,
            filters,
            activityType,
            eventsOnly: true
        })
            .then(data => {
                if (data) {
                    dispatch(setFilteredEventsData(data));
                    dispatch(setAppliedEventsFilters(appliedFilters));
                } else {
                    isFunction(discard) && discard();
                }
            })
            .catch(() => isFunction(discard) && discard())
            .finally(() => dispatch(setIsLoading(false)));
    };
};

const getStores = locationObj => dispatch => {
    storeUtils
        .getStores(locationObj, true, false, false, true, true)
        .then(stores => {
            dispatch(setStoresList(stores));
        })
        .catch(() => {
            dispatch(setStoresList([]));
        });
};

const showLocationAndStores = () => actions.showLocationAndStoresModal({ isOpen: true });

const closeLocationAndStores = () => actions.showLocationAndStoresModal({ isOpen: false });

const resetFiltersToDefault = () => dispatch => dispatch(setAppliedEventsFilters(defaultFilters));

const bookGuestService = options => async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await bookGuestServiceMutation(options);

            if (response?.guestBookingService) {
                if (response?.guestBookingService.errorCode === '500') {
                    const error = new Error('Error booking guest RSVP service');
                    error.errorMessage = response?.guestBookingService.errorMessage;
                    reject(error);
                } else {
                    resolve(response?.guestBookingService);
                }
            } else {
                reject(new Error('Error booking guest RSVP service'));
            }
        } catch (error) {
            reject(error);
        }
    });
};

const guestBookingDetails = confirmationId => async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await getGuestBookingDetailsQuery(confirmationId);
            const errorMessage = 'Error on guest booking details service';

            if (response?.guestBookingClientDetails) {
                if (response?.guestBookingClientDetails.errorCode === '500') {
                    const error = new Error(errorMessage);
                    error.errorMessage = response?.guestBookingClientDetails.errorMessage;
                    reject(error);
                } else {
                    resolve(response?.guestBookingClientDetails);
                }
            } else {
                reject(new Error(errorMessage));
            }
        } catch (error) {
            reject(error);
        }
    });
};

const reservationSensitiveDetails = confirmationId => async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await getReservationSensitiveDetails(confirmationId);
            const errorMessage = 'Error on reservation sensitive details service';

            if (response?.reservationSensitiveDetails) {
                if (response?.reservationSensitiveDetails.errorCode === '500') {
                    const error = new Error(errorMessage);
                    error.errorMessage = response?.reservationSensitiveDetails.errorMessage;
                    reject(error);
                } else {
                    resolve(response?.reservationSensitiveDetails);
                }
            } else {
                reject(new Error(errorMessage));
            }
        } catch (error) {
            reject(error);
        }
    });
};

export default {
    isNewPage,
    openPage,
    TYPES,
    getFilteredEvents,
    showLocationAndStores,
    closeLocationAndStores,
    setStoresList,
    getStores,
    setCurrentLocation,
    getLandingPagesCSC,
    resetFiltersToDefault,
    getEventEDPCSC,
    getMyReservationsCSC,
    getServiceBookingCSC,
    getApptConfirmationCSC,
    getWaitlistBookingCSC,
    getWaitlistConfirmationCSC,
    getWaitlistReservationCSC,
    getApptDetailsCSC,
    setCompactHeaderAndFooter,
    getSeasonalCSC,
    bookGuestService,
    guestBookingDetails,
    reservationSensitiveDetails
};
