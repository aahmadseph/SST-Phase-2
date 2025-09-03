import { WAITLIST_STATUS } from 'components/Content/Happening/ReservationDetails/constants';

const VARIANT_STYLES = {
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
    SPECIAL: 'special',
    LINK: 'link'
};

const ORIGIN_PAGES = {
    MY_RESERVATIONS_PAGE: 'my-reservations_page'
};

const EVENT_BUTTONS = {
    UPCOMING: [{ name: 'addToCal' }, { name: 'cancelRsvp' }],
    CANCELLED: [{ name: 'rsvp' }]
};

const SERVICE_BUTTONS = {
    UPCOMING: [{ name: 'addToCal' }, { name: 'reschedule' }, { name: 'cancel' }],
    PAST: [{ name: 'bookAgain' }, { name: 'productRecs' }],
    IS_DAY_AFTER: [{ name: 'bookAgain' }, { name: 'productRecs' }],
    CANCELLED: [{ name: 'bookAgain' }]
};

const MY_RESERVATIONS_SERVICE_BUTTONS = {
    UPCOMING: [{ name: 'reschedule', variant: VARIANT_STYLES.SECONDARY }, { name: 'cancel' }],
    PAST: [{ name: 'bookAgain' }, { name: 'productRecs' }],
    IS_DAY_AFTER: [{ name: 'bookAgain' }, { name: 'productRecs' }],
    CANCELLED: [{ name: 'bookAgain' }]
};

const MY_RESERVATIONS_EVENT_BUTTONS = {
    UPCOMING: [{ name: 'cancelRsvp', variant: VARIANT_STYLES.SECONDARY }],
    CANCELLED: [{ name: 'rsvp' }]
};

const MY_RESERVATIONS_WAITLIST_BUTTONS = {
    [WAITLIST_STATUS.WAITLIST]: [{ name: 'cancelWaitlist', variant: VARIANT_STYLES.SECONDARY }],
    [WAITLIST_STATUS.WAITLIST_HOLD]: [
        { name: 'declineAndCancel', variant: VARIANT_STYLES.SECONDARY },
        { name: 'bookNow', variant: VARIANT_STYLES.SPECIAL, callbackArgs: { originPage: ORIGIN_PAGES.MY_RESERVATIONS_PAGE } }
    ],
    [WAITLIST_STATUS.WAITLIST_EXPIRED]: [{ name: 'bookAgain', callbackArgs: { status: WAITLIST_STATUS.WAITLIST_EXPIRED } }],
    [WAITLIST_STATUS.WAITLIST_CANCELED]: [{ name: 'bookAgain', callbackArgs: { status: WAITLIST_STATUS.WAITLIST_CANCELED } }]
};

const WAITLIST_BUTTONS = {
    WAITLIST: [{ name: 'cancelWaitlist', variant: VARIANT_STYLES.SECONDARY }, { name: 'findAnotherTime' }],
    WAITLIST_HOLD: [{ name: 'bookNow', variant: VARIANT_STYLES.SPECIAL }, { name: 'declineAndCancel' }],
    WAITLIST_EXPIRED: [{ name: 'bookAgain' }],
    WAITLIST_CANCELED: [{ name: 'bookAgain' }],
    CANCEL_WAITLIST: [{ name: 'cancelWaitlist', variant: VARIANT_STYLES.SECONDARY }],
    DECLINE_WAITLIST: [{ name: 'declineAndCancelWaitlist', variant: VARIANT_STYLES.LINK }]
};

const HOURS_BEFORE_START_TIME = 24;
const SERVICES_FAQ_URL = '/beauty/beauty-services-faq?icid2=happening_services_faq_link_external';
const BEAUTY_SERVICES_FAQ_URL = '/beauty/beauty-services-faq?icid2=customer_service_beauty_services_faqs_action';

export {
    EVENT_BUTTONS,
    SERVICE_BUTTONS,
    HOURS_BEFORE_START_TIME,
    SERVICES_FAQ_URL,
    BEAUTY_SERVICES_FAQ_URL,
    MY_RESERVATIONS_SERVICE_BUTTONS,
    MY_RESERVATIONS_EVENT_BUTTONS,
    WAITLIST_BUTTONS,
    VARIANT_STYLES,
    MY_RESERVATIONS_WAITLIST_BUTTONS,
    ORIGIN_PAGES,
    WAITLIST_STATUS
};
