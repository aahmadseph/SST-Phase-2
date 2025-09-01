import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import GameDetails from 'components/Content/GameDetails';
import contentConstants from 'constants/content';
import RmnCarouselContent from 'components/Content/RmnCarouselContent';
import RmnBannerContent from 'components/Content/RmnBannerContent';
import HappeningEvents from 'components/Content/Happening/HappeningEvents';
import HappeningEDPInfo from 'components/Content/Happening/HappeningEDP/EDPInfo';
import HappeningEDPReservationPolicies from 'components/Content/Happening/HappeningEDP/EDPReservationPolicies';
import HappeningServiceReservationDetails from 'components/Content/Happening/ReservationDetails/ServiceDetails';
import HappeningEventReservationsDetails from 'components/Content/Happening/ReservationDetails/EventDetails';
import HappeningStoreDetails from 'components/Content/Happening/StoreDetails/StoreDetails';
import HappeningEventRSVPConfirmationDetails from 'components/Content/Happening/EventRSVPConfirmationDetails';
import HappeningBookingConfirmationDetails from 'components/Content/Happening/BookingConfirmationDetails';
import HappeningWaitlistConfirmationDetails from 'components/Content/Happening/WaitlistConfirmationDetails';
import HappeningWaitlistReservationDetails from 'components/Content/Happening/ReservationDetails/WaitlistDetails';
import MultiProductShadeFinderResults from 'components/Content/MultiProductShadeFinderResults';
import BugBounty from 'components/Content/BugBounty';
import GiftCardBalanceCheck from 'components/Content/GiftCards/GiftCardBalanceCheck';
import CustomerService from 'components/Content/CustomerService';
import ShopMyStoreHeader from 'components/ShopYourStore/ShopMyStoreHeader';
import ShopSameDayHeader from 'components/ShopYourStore/ShopSameDayHeader';
import FreeSamples from 'components/Content/FreeSamples';

const { RENDERING_TYPE } = contentConstants;
const { CallUs, ChatWithUs, EmailUs, OrderStatus } = CustomerService;

// eslint-disable-next-line complexity
const CustomRendering = ({ renderingType, ...props }) => {
    switch (renderingType) {
        case RENDERING_TYPE.GAME_DETAILS:
            return <GameDetails {...props} />;

        case RENDERING_TYPE.RMN_BANNER:
            return <RmnBannerContent />;

        case RENDERING_TYPE.RMN_CAROUSEL:
            return <RmnCarouselContent />;

        case RENDERING_TYPE.HAPPENING_EVENTS_GRID:
            return <HappeningEvents {...props} />;

        case RENDERING_TYPE.HAPPENING_SERVICE_EDP_INFO:
            return <HappeningEDPInfo {...props} />;

        case RENDERING_TYPE.HAPPENING_SERVICE_EDP_POLICIES:
            return <HappeningEDPReservationPolicies {...props} />;

        case RENDERING_TYPE.HAPPENING_EVENT_EDP_INFO:
            return <HappeningEDPInfo {...props} />;

        case RENDERING_TYPE.HAPPENING_STORE_DETAILS:
            return <HappeningStoreDetails {...props} />;

        case RENDERING_TYPE.HAPPENING_RSVP_CONFIRMATION_DETAILS:
            return <HappeningEventRSVPConfirmationDetails {...props} />;

        case RENDERING_TYPE.HAPPENING_SERVICES_CONFIRMATION_DETAILS:
            return <HappeningBookingConfirmationDetails {...props} />;

        case RENDERING_TYPE.HAPPENING_WAITLIST_CONFIRMATION_DETAILS:
            return <HappeningWaitlistConfirmationDetails {...props} />;

        case RENDERING_TYPE.HAPPENING_WAITLIST_RESERVATION_DETAILS:
            return <HappeningWaitlistReservationDetails {...props} />;

        case RENDERING_TYPE.HAPPENING_SHOP_MY_STORE: {
            return <ShopMyStoreHeader {...props} />;
        }

        case RENDERING_TYPE.HAPPENING_SHOP_SAME_DAY: {
            return <ShopSameDayHeader {...props} />;
        }

        case RENDERING_TYPE.CS_CHAT_WITH_US:
            return <ChatWithUs {...props} />;

        case RENDERING_TYPE.CS_CALL_US:
            return <CallUs {...props} />;

        case RENDERING_TYPE.CS_EMAIL_US:
            return <EmailUs {...props} />;

        case RENDERING_TYPE.CS_ORDER_STATUS:
            return <OrderStatus {...props} />;

        case RENDERING_TYPE.MULTI_PRODUCT_SHADE_FINDER_RESULTS:
            return <MultiProductShadeFinderResults {...props} />;

        case RENDERING_TYPE.BUG_BOUNTY:
            return <BugBounty {...props} />;

        case RENDERING_TYPE.GIFT_CARD_BALANCE_CHECK:
            return <GiftCardBalanceCheck />;

        case RENDERING_TYPE.HAPPENING_SERVICE_RESERVATION_DETAILS:
            return <HappeningServiceReservationDetails {...props} />;

        case RENDERING_TYPE.HAPPENING_EVENT_RESERVATION_DETAILS:
            return <HappeningEventReservationsDetails {...props} />;

        case RENDERING_TYPE.FREE_SAMPLES:
            return <FreeSamples {...props} />;

        default:
            return null;
    }
};

CustomRendering.propTypes = {
    renderingType: PropTypes.string
};

export default wrapFunctionalComponent(CustomRendering, 'CustomRendering');
