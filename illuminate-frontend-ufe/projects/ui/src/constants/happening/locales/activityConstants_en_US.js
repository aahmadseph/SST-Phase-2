export default function getResource(label, vars = []) {
    const resources = {
        HAPPENING_AT_SEPHORA: 'Happening at Sephora',
        SERVICE_AND_EVENTS: 'Services and Events at Sephora',
        ANNOUNCEMENT_DISPLAY_TEXT: 'What’s New',

        SEO_SERVICES: 'Services',
        SEO_CLASSES: 'Classes',
        SEO_EVENTS: 'Events',
        SEO_ANNOUNCEMENTS: 'Announcements',

        FLAG_SERVICES: 'service',
        FLAG_CLASSES: 'class',
        FLAG_EVENTS: 'event',

        CAROUSEL_TYPE_STORE: 'Happening at Sephora',
        CAROUSEL_TYPE_FEATURED: 'Featured',
        CAROUSEL_TYPE_SERVICES: 'Services',
        CAROUSEL_TYPE_SERVICES_SUBTITLE: 'From touch-ups & makeovers to quick-fix facials, let’s make your beauty goals happen.',
        CAROUSEL_TYPE_CLASSES: 'Classes',
        CAROUSEL_TYPE_CLASSES_SUBTITLE: 'Learn makeup techniques, personalize your skincare routine & more with our free classes.',
        CAROUSEL_TYPE_EVENTS: 'Events',
        CAROUSEL_TYPE_EVENTS_SUBTITLE: 'Grab a friend and join us in store to celebrate with top brands, try new products & more.',
        CAROUSEL_TYPE_ANNOUNCEMENTS_SUBTITLE: 'Be the first to know about celeb appearances, brand launches, store openings & more.',

        OLR_LANDING_PAGE_SEO_TITLE: 'Happening at Sephora - Beauty Classes, Services, Events & Announcements | Sephora',
        OLR_LANDING_PAGE_SEO_DESCRIPTION: 'Find information about in-store beauty classes, services, events & announcements at Sephora.',

        RESERVATION_STATUS_BOOKED_LIST: 'Booked',
        RESERVATION_STATUS_BOOKED: 'Booked',
        RESERVATION_STATUS_RSVPD_LIST: 'RSVPd',
        RESERVATION_STATUS_RSVPD: 'RSVPd',
        RESERVATION_STATUS_WAITLISTED_LIST: 'Waitlisted',
        RESERVATION_STATUS_WAITLISTED: 'Waitlisted. We’ll contact you when a seat is available.',
        RESERVATION_STATUS_CANCELED: 'Your appointment has been cancelled. Thanks for letting us know!',
        RESERVATION_STATUS_RESCHEDULED: 'Rescheduled',
        RESERVATION_STATUS_ERROR: 'Your new reservation has been booked. We were unable to cancel your previous reservation. Please try again later',

        WHAT_TO_EXPECT_SERVICES: 'This service is performed by a Licensed Beauty Advisor at the Beauty Studio. Arriving with skin free of makeup is preferred but not required.',
        WHAT_TO_EXPECT_SERVICES_CANADA_OR_FREE: 'All services are performed by our talented Beauty Advisors in a one-on-one setting. Arriving with a clean face is preferred, but not required. Application is focused on one feature for Mini Services, and the full face for Deluxe Services. Duration varies depending on your selection.',
        WHAT_TO_EXPECT_CLASSES: 'Classes take place in a group setting and are taught by our talented Beauty Advisors. You’ll be applying everything yourself to walk away with the skills necessary to do it all at home. Products and brushes are supplied with the exception of false lashes, which must be purchased.',

        ALL_STORES_TEXT: 'All Stores',

        PRICE_FREE: 'FREE',
        PAYMENT_HEADER: 'Payment',
        PAYMENT_TEXT: 'Payment will be collected in store at the time of service.',
        PAYMENT_WITH_PRICE_TEXT: `${vars[0]} fee plus applicable taxes will be collected in store at the time of service. Payment applies to service only and does not count toward product purchase.`,
        PAYMENT_TEXT_MAKEUP_DELUXE: 'Service Fee applies to all Sephora Clients, regardless of Beauty Insider Tier level.',
        PAYMENT_TEXT_PERSONAL_SHOPPING_SERVICE: 'Complimentary with a minimum $50 purchase in-store on the same day as the appointment.',
        ONTIME_HEADER: 'On-time Policy',
        ONTIME_TEXT: 'Don’t be late! Be respectful of our Beauty Advisor’s time. Late arrivals risk losing their appointments.'
    };

    return resources[label];
}
