import localeUtils from 'utils/LanguageLocale';

const getText = localeUtils.getLocaleResourceFile('constants/happening/locales', 'activityConstants');

const HAPPENING_AT_SEPHORA = getText('HAPPENING_AT_SEPHORA');

const SERVICE_AND_EVENTS = getText('SERVICE_AND_EVENTS');

const ANY_ARTIST = 'ANY_ARTIST';

const TYPE = {
    SERVICES: 'services',
    CLASSES: 'classes',
    EVENTS: 'events',
    ANNOUNCEMENTS: 'announcements'
};

const ANALYTICS_OLR_EXPERIENCE = {
    [TYPE.SERVICES]: 'service',
    [TYPE.CLASSES]: 'class',
    [TYPE.EVENTS]: 'event',
    [TYPE.ANNOUNCEMENTS]: 'announcement'
};

const ANALYTICS_OLR_PAGES = {
    BEAUTY_SERVICES_FAQ: 'beauty services faq',
    FIND_A_STORE: 'find a store',
    HAPPENING_AT_SEPHORA: 'happening at sephora',
    HUB: 'home',
    MAKEUP_SERVICES: 'makeup services',
    MY_RESERVATIONS: 'my reservations'
};

const SEO_LABEL = {
    [TYPE.SERVICES]: getText('SEO_SERVICES'),
    [TYPE.CLASSES]: getText('SEO_CLASSES'),
    [TYPE.EVENTS]: getText('SEO_EVENTS'),
    [TYPE.ANNOUNCEMENTS]: getText('SEO_ANNOUNCEMENTS')
};

const ANNOUNCEMENT_DISPLAY_TEXT = getText('ANNOUNCEMENT_DISPLAY_TEXT');

const FLAGS_OLR_EXPERIENCE = {
    [TYPE.SERVICES]: getText('FLAG_SERVICES'),
    [TYPE.CLASSES]: getText('FLAG_CLASSES'),
    [TYPE.EVENTS]: getText('FLAG_EVENTS'),
    [TYPE.ANNOUNCEMENTS]: ANNOUNCEMENT_DISPLAY_TEXT
};

const CAROUSEL_TYPE = {
    store: { title: getText('CAROUSEL_TYPE_STORE') },
    featured: { title: getText('CAROUSEL_TYPE_FEATURED') },
    [TYPE.SERVICES]: {
        title: getText('CAROUSEL_TYPE_SERVICES'),
        subtitle: getText('CAROUSEL_TYPE_SERVICES_SUBTITLE')
    },
    [TYPE.CLASSES]: {
        title: getText('CAROUSEL_TYPE_CLASSES'),
        subtitle: getText('CAROUSEL_TYPE_CLASSES_SUBTITLE')
    },
    [TYPE.EVENTS]: {
        title: getText('CAROUSEL_TYPE_EVENTS'),
        subtitle: getText('CAROUSEL_TYPE_EVENTS_SUBTITLE')
    },
    [TYPE.ANNOUNCEMENTS]: {
        title: ANNOUNCEMENT_DISPLAY_TEXT,
        subtitle: getText('CAROUSEL_TYPE_ANNOUNCEMENTS_SUBTITLE')
    }
};

const WHAT_TO_EXPECT = {
    [TYPE.SERVICES]: getText('WHAT_TO_EXPECT_SERVICES'),
    [TYPE.CLASSES]: getText('WHAT_TO_EXPECT_CLASSES'),
    [TYPE.SERVICES + '_CA_OR_FREE']: getText('WHAT_TO_EXPECT_SERVICES_CANADA_OR_FREE')
};

const FILTER = {
    DAY: 'day',
    TIME: 'time',
    TYPE: 'type',
    LOCATION: 'location',
    STORE: 'store'
};

/* Reflects possible values of 'reservationAction' in timeSlots entities */
const RESERVATION_ACTIONS = {
    RESERVE: 'reserve',
    WAITLIST: 'waitlist',
    DISABLED: 'disabled_at_capacity'
};

/* Reflects possible values of 'bookingStatus' options for /reservations SDN  */
const BOOKING_STATUS = {
    REGISTERED: 'REGISTERED',
    WAITLISTED: 'WAITLISTED'
};

/* Reflects FE statuses of reservations, depends on BOOKING_STATUS and user actions */
const RESERVATION_STATUS = {
    BOOKED: 'booked',
    RSVPD: 'rsvpd',
    WAITLISTED: 'waitlisted',
    CANCELED: 'canceled',
    CANCELLED: 'Cancelled',
    RESCHEDULED: 'rescheduled',
    CANCEL_ERROR: 'cancelError'
};

const RESERVATION_STATUS_CTA = {
    [RESERVATION_STATUS.BOOKED]: {
        listText: getText('RESERVATION_STATUS_BOOKED_LIST'),
        confirmationText: getText('RESERVATION_STATUS_BOOKED')
    },
    [RESERVATION_STATUS.RSVPD]: {
        listText: getText('RESERVATION_STATUS_RSVPD_LIST'),
        confirmationText: getText('RESERVATION_STATUS_RSVPD')
    },
    [RESERVATION_STATUS.WAITLISTED]: {
        listText: getText('RESERVATION_STATUS_WAITLISTED_LIST'),
        confirmationText: getText('RESERVATION_STATUS_WAITLISTED')
    },
    [RESERVATION_STATUS.CANCELED]: { confirmationText: getText('RESERVATION_STATUS_CANCELED') },
    [RESERVATION_STATUS.RESCHEDULED]: { confirmationText: getText('RESERVATION_STATUS_RESCHEDULED') },
    [RESERVATION_STATUS.CANCEL_ERROR]: { confirmationText: getText('RESERVATION_STATUS_ERROR') }
};

const OLR_LANDING_PAGE_SEO_DATA = {
    TITLE: getText('OLR_LANDING_PAGE_SEO_TITLE'),
    DESCRIPTION: getText('OLR_LANDING_PAGE_SEO_DESCRIPTION'),
    CANONICAL_URL: '/happening/home'
};

const isActivityTypeValid = activityType => {
    return Object.values(TYPE).some(type => type === activityType);
};

const OLR_URLS = {
    LANDING_PAGE: '/happening/home',
    MAKEUP_SERVICES: '/happening/makeup-services',
    RESERVATION: '/happening/reservations',
    STORE_LOCATOR: '/happening/stores/sephora-near-me',
    COMPLETE_STORE_LIST: '/happening/storelist',
    SERVICES_FAQ: '/happening/services-faq',
    EVENTS: ' /happening/events'
};

const RSVP_MODAL_ACTIONS = {
    RSVP: 'rsvp',
    CAL: 'calendar'
};

const ALL_STORES_TEXT = getText('ALL_STORES_TEXT');

const LOCATION_RESULTS_INCREMENT = 6;
const ACTIVITIES_STARTDATE_MAX = 90; // days from 'today'
const PRICE_FREE = getText('PRICE_FREE');
const PAYMENT_HEADER = getText('PAYMENT_HEADER');
const PAYMENT_TEXT = getText('PAYMENT_TEXT');
const PAYMENT_WITH_PRICE_TEXT = priceText => getText('PAYMENT_WITH_PRICE_TEXT', [priceText]);
const PAYMENT_TEXT_MAKEUP_DELUXE = getText('PAYMENT_TEXT_MAKEUP_DELUXE');
const PAYMENT_TEXT_PERSONAL_SHOPPING_SERVICE = getText('PAYMENT_TEXT_PERSONAL_SHOPPING_SERVICE');
const ONTIME_HEADER = getText('ONTIME_HEADER');
const ONTIME_TEXT = getText('ONTIME_TEXT');

const SUBSECTION_HEADER_PROPS = {
    is: 'h3',
    fontWeight: 'var(--font-weight-bold)',
    lineHeight: 'tight',
    marginTop: 4,
    marginBottom: 1
};

const MAKEUP_DELUXE_SERVICE_ACTIVITY_ID = 'OLR-CD__makeup_deluxe_makeover';
const PERSONAL_SHOPPING_SERVICE_ACTIVITY_ID = 'OLR-CD__personal_shopping_service_20min';

const WAIVER = {
    ACKFORCLIENT: 'AckforClient',
    ACKFORCLIENTUNDER18: 'Ackforclientunder18'
};

export default {
    ANY_ARTIST,
    HAPPENING_AT_SEPHORA,
    SERVICE_AND_EVENTS,
    TYPE,
    SEO_LABEL,
    ANALYTICS_OLR_EXPERIENCE,
    ANALYTICS_OLR_PAGES,
    FLAGS_OLR_EXPERIENCE,
    CAROUSEL_TYPE,
    WHAT_TO_EXPECT,
    FILTER,
    RESERVATION_ACTIONS,
    BOOKING_STATUS,
    RESERVATION_STATUS,
    RESERVATION_STATUS_CTA,
    OLR_URLS,
    OLR_LANDING_PAGE_SEO_DATA,
    RSVP_MODAL_ACTIONS,
    isActivityTypeValid,
    ANNOUNCEMENT_DISPLAY_TEXT,
    LOCATION_RESULTS_INCREMENT,
    ACTIVITIES_STARTDATE_MAX,
    ALL_STORES_TEXT,
    PRICE_FREE,
    PAYMENT_HEADER,
    PAYMENT_TEXT,
    PAYMENT_WITH_PRICE_TEXT,
    ONTIME_HEADER,
    ONTIME_TEXT,
    SUBSECTION_HEADER_PROPS,
    MAKEUP_DELUXE_SERVICE_ACTIVITY_ID,
    PERSONAL_SHOPPING_SERVICE_ACTIVITY_ID,
    PAYMENT_TEXT_PERSONAL_SHOPPING_SERVICE,
    PAYMENT_TEXT_MAKEUP_DELUXE,
    WAIVER
};
