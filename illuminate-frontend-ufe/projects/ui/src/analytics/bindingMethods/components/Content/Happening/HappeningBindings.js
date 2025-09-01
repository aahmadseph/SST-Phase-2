import anaConsts from 'analytics/constants';
import anaUtils from 'analytics/utils';
import processEvent from 'analytics/processEvent';
import {
    isWaitlistStatus, isWaitlistHold, isWaitlistExpired, isWaitlistCanceled
} from 'utils/happeningReservation';

const {
    LINK_TRACKING_EVENT, ASYNC_PAGE_LOAD, EVENT_NAMES, PAGE_NAMES, PAGE_DETAIL
} = anaConsts;

const { HAPPENING_AT_SEPHORA } = EVENT_NAMES;

const {
    RESERVATION_DETAILS, CANCEL_EVENT_CONFIRMATION, RSVP_BOOKING, BOOK_RESERVATION_PHONE_VALIDATION, START_BOOKING, CONTINUE_AS_A_GUEST
} =
    HAPPENING_AT_SEPHORA;

const pageType = anaConsts.PAGE_TYPES.OLR;

// fires s.tl call
const triggerSOTAnalytics = eventData => {
    processEvent.process(LINK_TRACKING_EVENT, { data: eventData });
};

// fires s.t call
const triggerAPLAnalytics = eventData => {
    processEvent.process(ASYNC_PAGE_LOAD, { data: eventData });
};

const resetEventsData = () => {
    anaUtils.setNextPageData({
        navigationInfo: '',
        eventStrings: []
    });
};

const eventRSVPConfirmationPageLoadAnalytics = (activityName = '', storeId) => {
    const name = activityName.toLowerCase();
    digitalData.page.category.pageType = pageType;
    digitalData.page.pageInfo.pageName = 'book an event-rsvp';
    digitalData.page.attributes.world = 'n/a';
    digitalData.page.attributes.additionalPageInfo = `title=${name}`;
    digitalData.page.attributes.previousPageData = {
        ...digitalData.page?.attributes?.previousPageData,
        linkData: `happening:${RSVP_BOOKING}:event:${name}`,
        events: [anaConsts.Event.RSVP_EVENT_SUCCESS]
    };
    digitalData.page.attributes.experienceDetails = {
        ...digitalData.page.attributes?.experienceDetails,
        storeId
    };

    resetEventsData();
};

const triggerCancelEventAnalytics = (activityName = '', storeId, type) => {
    triggerSOTAnalytics({
        pageName: `${pageType}:${CANCEL_EVENT_CONFIRMATION}:n/a:*title=${activityName.toLowerCase()}`,
        storeId,
        actionInfo: `happening:canceled booking:${type === 'events' ? 'event' : 'service'}:${activityName.toLowerCase()}`
    });
};

const triggerRescheduleEventAnalytics = (activityName = '', storeId, type) => {
    const pageName = `${pageType}:reschedule ${type}-confirmation:n/a:*title=${activityName.toLowerCase()}`;

    const eventData = {
        pageName,
        storeId,
        actionInfo: `happening:reschedule booking:${type === 'events' ? 'event' : 'service'}:${activityName.toLowerCase()}`,
        previousPageName: digitalData.page.attributes.sephoraPageInfo.pageName,
        eventStrings: [anaConsts.Event.EVENT_219]
    };

    triggerAPLAnalytics(eventData);
};

const serviceBookingCancelledAnalytics = (activityName = '', storeId) => {
    const name = activityName.toLowerCase();
    const prop55 = `happening:canceled booking:service:${name}`;

    const eventData = {
        storeId,
        linkData: prop55,
        eventStrings: [anaConsts.Event.EVENT_219]
    };

    triggerAPLAnalytics(eventData);
};

const myReservationsPageLoadAnalytics = () => {
    digitalData.page.category.pageType = pageType;
    digitalData.page.pageInfo.pageName = PAGE_NAMES.MY_RESERVATIONS;
    digitalData.page.attributes.world = 'n/a';
};

const serviceReservationDetailsPageLoadAnalytics = (activityName = '', storeId, isCanceled = false, isGuest = false) => {
    const status = isCanceled ? 'cancel service-confirmation' : 'book a service-confirmation';
    const pageName = isGuest ? `happening at sephora:cancel service-confirmation:guest:*title=${activityName}` : status;
    const guestFlowProp55 = 'happening:canceled booking:service';

    digitalData.page.category.pageType = pageType;
    digitalData.page.pageInfo.pageName = pageName;
    digitalData.page.attributes.world = isGuest ? 'guest' : 'n/a';
    digitalData.page.attributes.additionalPageInfo = `title=${activityName.toLowerCase()}`;

    if (digitalData.page.attributes?.experienceDetails) {
        digitalData.page.attributes.experienceDetails.storeId = storeId;
    } else {
        digitalData.page.attributes.experienceDetails = { storeId };
    }

    const { prop55 = '' } = anaUtils.getPreviousPageData();
    const [, previousOrigin = ''] = prop55.split(':');

    if (isCanceled && 'canceled booking' === previousOrigin) {
        digitalData.page.attributes.previousPageData = {
            ...digitalData.page?.attributes?.previousPageData,
            linkData: isGuest ? guestFlowProp55 : prop55,
            events: [anaConsts.Event.EVENT_219]
        };

        anaUtils.setNextPageData({
            eventStrings: []
        });
    }

    anaUtils.setNextPageData({
        navigationInfo: ''
    });
};

const eventReservationDetailsPageLoadAnalytics = (activityName = '', storeId, isCanceled = false) => {
    const status = isCanceled ? 'cancel event-confirmation' : 'book an event-rsvp';

    digitalData.page.category.pageType = pageType;
    digitalData.page.pageInfo.pageName = status;
    digitalData.page.attributes.world = 'n/a';
    digitalData.page.attributes.additionalPageInfo = `title=${activityName.toLowerCase()}`;

    if (digitalData.page.attributes?.experienceDetails) {
        digitalData.page.attributes.experienceDetails.storeId = storeId;
    } else {
        digitalData.page.attributes.experienceDetails = { storeId };
    }

    const { prop55 = '' } = anaUtils.getPreviousPageData();
    const [, previousOrigin = ''] = prop55.split(':');

    if (isCanceled && 'canceled booking' === previousOrigin) {
        digitalData.page.attributes.previousPageData = {
            ...digitalData.page?.attributes?.previousPageData,
            linkData: prop55,
            events: [anaConsts.Event.EVENT_219]
        };

        anaUtils.setNextPageData({
            eventStrings: []
        });
    }

    anaUtils.setNextPageData({
        navigationInfo: ''
    });
};

const serviceDetailsPageLoadAnalytics = (activityName = '', storeId) => {
    digitalData.page.category.pageType = pageType;
    digitalData.page.pageInfo.pageName = 'book a service-landing';
    digitalData.page.attributes.world = 'n/a';
    digitalData.page.attributes.additionalPageInfo = `title=${activityName.toLowerCase()}`;
    digitalData.page.attributes.previousPageData = {
        ...digitalData.page?.attributes?.previousPageData,
        linkData: `happening:start booking:service:${activityName.toLowerCase()}`,
        events: []
    };
    digitalData.page.attributes.experienceDetails = {
        ...digitalData.page.attributes?.experienceDetails,
        storeId: storeId
    };

    resetEventsData();
};

const eventDetailsPageLoadAnalytics = (activityName = '', storeId) => {
    digitalData.page.category.pageType = pageType;
    digitalData.page.pageInfo.pageName = 'book a event-landing';
    digitalData.page.attributes.world = 'n/a';

    digitalData.page.attributes.additionalPageInfo = `title=${activityName.toLowerCase()}`;
    digitalData.page.attributes.previousPageData = {
        ...digitalData.page?.attributes?.previousPageData,
        linkData: `happening:start booking:event:${activityName.toLowerCase()}`,
        events: [anaConsts.Event.EVENT_214]
    };
    digitalData.page.attributes.experienceDetails = {
        ...digitalData.page.attributes?.experienceDetails,
        storeId: storeId
    };

    resetEventsData();
};

const eventDetailsPhoneValidationPageLoadAnalytics = (eventName = '', storeId, type, guest = false) => {
    const name = eventName.toLowerCase();
    const prop55 = `happening:${guest ? CONTINUE_AS_A_GUEST : START_BOOKING}:${type}`;
    const eventData = {
        pageType: anaConsts.PAGE_TYPES.OLR,
        pageName: `${pageType}:${BOOK_RESERVATION_PHONE_VALIDATION}:${guest ? 'guest' : 'n/a'}:*title=${name}`,
        actionInfo: prop55,
        storeId
    };

    digitalData.page.attributes.previousPageData = {
        ...digitalData.page?.attributes?.previousPageData,
        linkData: prop55
    };

    triggerAPLAnalytics(eventData);
};

const serviceBookingPickStorePageLoadAnalytics = (activityName = '') => {
    const name = activityName.toLowerCase();
    digitalData.page.category.pageType = pageType;
    digitalData.page.pageInfo.pageName = RESERVATION_DETAILS;
    digitalData.page.attributes.world = 'step1';
    digitalData.page.attributes.additionalPageInfo = `title=${activityName}`;

    digitalData.page.attributes.previousPageData = {
        ...digitalData.page?.attributes?.previousPageData,
        linkData: `happening:continue booking:service:${name}`,
        events: [anaConsts.Event.EVENT_214]
    };

    resetEventsData();
};

const serviceBookingPickArtistDateTimePageLoadAnalytics = (activityName = '') => {
    const pageName = `${pageType}:${RESERVATION_DETAILS}:step2:*title=${activityName.toLowerCase()}`;

    triggerAPLAnalytics({ pageName });
};

const serviceBookingReviewAndPayPageLoadAnalytics = (activityName = '', storeId, bookingType, guest = false) => {
    const pageName = `${pageType}:${RESERVATION_DETAILS}:step3${guest ? '-guest' : ''}:*title=${activityName.toLowerCase()}`;
    const prop55 = `happening:${guest ? HAPPENING_AT_SEPHORA.CONTINUE_AS_GUEST : HAPPENING_AT_SEPHORA.CONTINUE_BOOKING}:${bookingType}`;

    if (guest) {
        digitalData.page.attributes.sephoraPageInfo.pageName = `${pageType}:${RESERVATION_DETAILS}:step3:*title=${activityName.toLowerCase()}`;
    }

    triggerAPLAnalytics({
        pageName,
        linkData: prop55,
        storeId
    });
};

const serviceBookingShowMapLinkAnalytics = (activityName = '') => {
    const prop55 = `happening:${PAGE_DETAIL.RESERVATION_DETAILS}:${HAPPENING_AT_SEPHORA.SHOW_MAP}:${activityName.toLowerCase()}`;

    triggerSOTAnalytics({ actionInfo: prop55 });
};

const serviceBookingShowCalendarPageLoadAnalytics = (activityName = '') => {
    const pageName = `${pageType}:${PAGE_NAMES.BOOK_SERVICE_DATE_LOCATION}:n/a:*title=${activityName.toLowerCase()}`;

    triggerAPLAnalytics({ pageName });
};

const serviceBookingBasePageLoadAnalytics = ({
    name, pageName, linkData, storeId, events = []
}) => {
    digitalData.page.category.pageType = pageType;
    digitalData.page.pageInfo.pageName = pageName;
    digitalData.page.attributes.world = 'n/a';
    digitalData.page.attributes.additionalPageInfo = `title=${name}`;
    digitalData.page.attributes.previousPageData = {
        ...digitalData.page?.attributes?.previousPageData,
        linkData,
        events
    };
    digitalData.page.attributes.experienceDetails = {
        ...digitalData.page.attributes?.experienceDetails,
        storeId
    };

    resetEventsData();
};

const serviceBookingConfirmationPageLoadAnalytics = (activityName = '', storeId) => {
    const name = activityName.toLowerCase();
    const pageName = PAGE_NAMES.BOOK_SERVICE_CONFIRMATION;
    const linkData = `happening:confirm booking:service:${name}`;
    const events = [anaConsts.Event.BOOK_RESERVATION_SUCCESS];

    serviceBookingBasePageLoadAnalytics({
        name,
        pageName,
        events,
        linkData,
        storeId
    });
};

const serviceBookingReschedulePageLoadAnalytics = (activityName = '', storeId) => {
    const name = activityName.toLowerCase();
    const pageName = PAGE_NAMES.RESCHEDULE_SERVICE_CONFIRMATION;
    const linkData = `happening:reschedule booking:service:${name}`;
    const events = [anaConsts.Event.RESCHEDULE_SUCCESS];

    serviceBookingBasePageLoadAnalytics({
        name,
        pageName,
        events,
        linkData,
        storeId
    });
};

const waitlistBookingFindAnotherTimePageLoadAnalytics = (activityName = '', storeId) => {
    const name = activityName.toLowerCase();
    const pageName = PAGE_NAMES.RESCHEDULE_SERVICE_CONFIRMATION;
    const linkData = `happening:find another time:${name}`;

    serviceBookingBasePageLoadAnalytics({
        name,
        pageName,
        linkData,
        storeId
    });
};

const actionButtonsCancelBookingLinkAnalytics = (activityName = '') => {
    triggerSOTAnalytics({ actionInfo: `happening:${HAPPENING_AT_SEPHORA.CANCEL_BOOKING}:${activityName.toLowerCase()}` });
};

const actionButtonsAddToCalendarLinkAnalytics = (activityName = '') => {
    triggerSOTAnalytics({ actionInfo: `happening:${HAPPENING_AT_SEPHORA.ADD_TO_CALENDAR}:${activityName.toLowerCase()}` });
};

const seasonalPageLoadAnalytics = () => {
    digitalData.page.category.pageType = pageType;
    digitalData.page.pageInfo.pageName = PAGE_NAMES.CURATED_SEASONAL_LANDING;
    digitalData.page.attributes.world = 'n/a';

    resetEventsData();
};

const waitlistPageLoadAnalytics = (subStatus, activityName = '', storeId) => {
    digitalData.page.category.pageType = pageType;

    if (isWaitlistStatus(subStatus)) {
        digitalData.page.pageInfo.pageName = 'waitlist detail-pending';
    }

    if (isWaitlistHold(subStatus)) {
        digitalData.page.pageInfo.pageName = 'waitlist detail-approved';
    }

    if (isWaitlistExpired(subStatus)) {
        digitalData.page.pageInfo.pageName = 'waitlist detail-expired';
    }

    if (isWaitlistCanceled(subStatus)) {
        digitalData.page.pageInfo.pageName = 'waitlist detail-cancaled';
    }

    digitalData.page.attributes.world = 'n/a';
    digitalData.page.attributes.additionalPageInfo = `title=${activityName.toLowerCase()}`;

    digitalData.page.attributes.experienceDetails = {
        ...digitalData.page.attributes?.experienceDetails,
        storeId
    };

    resetEventsData();
};

const actionButtonCancelWaitlistLinkAnalytics = (activityName = '') => {
    const pageDetail = `title=${activityName.toLowerCase()}`;
    const waitlistPageName = digitalData.page.pageInfo.pageName;
    const world = 'n/a';
    const pageName = `${pageType}:${waitlistPageName}:${world}:${pageDetail}`;

    const prop55 = `happening:cancel waitlist:${activityName.toLowerCase()}`;

    triggerSOTAnalytics({
        pageType,
        pageName,
        world,
        actionInfo: prop55
    });
};

const actionButtonBookAgainWaitlistLinkAnalytics = (activityName = '', status) => {
    let prop55 = null;

    if (isWaitlistExpired(status)) {
        prop55 = `happening:book again:waitlist expired:${activityName.toLowerCase()}`;
    }

    if (isWaitlistCanceled(status)) {
        prop55 = `happening:book again:waitlist canceled:${activityName.toLowerCase()}`;
    }

    if (prop55) {
        digitalData.page.attributes.previousPageData = {
            ...digitalData.page.attributes.previousPageData,
            linkData: prop55
        };
        anaUtils.setNextPageData({
            linkData: prop55
        });
    }
};

//Guest booking flow
const guestBookingFlowConfirmationPageLoad = (displayName, store) => {
    digitalData.page.attributes.experienceDetails = { storeId: store };
    digitalData.page.attributes.pageLoadEventStrings = [anaConsts.Event.BOOK_RESERVATION_SUCCESS];
    digitalData.page.attributes.previousPageData.linkData = 'happening:confirm guest booking:service';
    digitalData.page.pageInfo.pageName = `happening at sephora:book a service-confirmation:guest:*title=${displayName.toLowerCase()}`;
};

const guestBookingFlowCreateAccountAction = () => {
    digitalData.page.attributes.previousPageData.linkData = 'happening:guest booking:create account:service';
};

const guestBookingFlowCancelAction = displayName => {
    digitalData.page.attributes.previousPageData.linkData = `happening:cancel booking:${displayName.toLowerCase()}`;
    digitalData.page.pageInfo.pageName = `happening at sephora:book a service-confirmation:guest:*title=${displayName.toLowerCase()}`;
};

const guestBookingFlowAddToCalendarAction = displayName => {
    digitalData.page.attributes.previousPageData.linkData = `happening:add to calendar:${displayName.toLowerCase()}`;
    digitalData.page.pageInfo.pageName = `happening at sephora:book a service-confirmation:guest:*title=${displayName.toLowerCase()}`;
};

const guestBookingFlowConfirmationPageLoadOnReschedule = (displayName, store) => {
    digitalData.page.attributes.experienceDetails = { storeId: store };
    digitalData.page.attributes.pageLoadEventStrings = [anaConsts.Event.BOOK_RESERVATION_SUCCESS];
    digitalData.page.attributes.previousPageData.linkData = `happening:reschedule booking:service:${displayName.toLowerCase()}`;
    anaUtils.setNextPageData({ pageName: `happening at sephora:book a service-confirmation:guest:*title=${displayName.toLowerCase()}` });
    digitalData.page.pageInfo.pageName = `happening at sephora:reschedule service-confirmation:n/a:*title=${displayName.toLowerCase()}`;
};

const setCreateAccountOnGuestReservation = () => {
    digitalData.page.attributes.previousPageData = {
        ...digitalData.page.attributes.previousPageData,
        linkData: 'happening:guest reservation detail:create account:service'
    };
};

export default {
    triggerSOTAnalytics,
    triggerAPLAnalytics,
    eventRSVPConfirmationPageLoadAnalytics,
    triggerCancelEventAnalytics,
    triggerRescheduleEventAnalytics,
    serviceDetailsPageLoadAnalytics,
    serviceBookingCancelledAnalytics,
    myReservationsPageLoadAnalytics,
    serviceReservationDetailsPageLoadAnalytics,
    eventReservationDetailsPageLoadAnalytics,
    eventDetailsPhoneValidationPageLoadAnalytics,
    eventDetailsPageLoadAnalytics,
    serviceBookingPickStorePageLoadAnalytics,
    serviceBookingShowMapLinkAnalytics,
    serviceBookingPickArtistDateTimePageLoadAnalytics,
    serviceBookingShowCalendarPageLoadAnalytics,
    serviceBookingReviewAndPayPageLoadAnalytics,
    serviceBookingConfirmationPageLoadAnalytics,
    serviceBookingReschedulePageLoadAnalytics,
    actionButtonsCancelBookingLinkAnalytics,
    actionButtonsAddToCalendarLinkAnalytics,
    seasonalPageLoadAnalytics,
    waitlistPageLoadAnalytics,
    actionButtonCancelWaitlistLinkAnalytics,
    waitlistBookingFindAnotherTimePageLoadAnalytics,
    actionButtonBookAgainWaitlistLinkAnalytics,
    setCreateAccountOnGuestReservation,
    guestBookingFlowConfirmationPageLoad,
    guestBookingFlowCreateAccountAction,
    guestBookingFlowCancelAction,
    guestBookingFlowAddToCalendarAction,
    guestBookingFlowConfirmationPageLoadOnReschedule
};
