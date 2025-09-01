import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
const { wrapHOC } = FrameworkUtils;
import { getDaysInTransit } from 'utils/CanadaPostStrike';
import contentConstants from 'constants/content';
const { COMPONENT_TYPES } = contentConstants;

import orderLocaleSelector from 'selectors/order/orderDetails/header/orderLocale/orderLocaleSelector';

const NOT_IMPACTED = 'Canada_Post_Strike_Not_Impacted';
const DELAYED = 'Canada_Post_Strike_Delayed';
const CA = 'CA';

const fields = createSelector(
    (_state, ownProps) => ownProps.shippingGroup,
    (_state, ownProps) => ownProps.middleZone,
    orderLocaleSelector,
    (shippingGroup, middleZone, orderLocale) => {
        const canadaPostStrikeConfiguration = Sephora.configurationSettings?.canadaPostStrikeConfiguration || {};
        const isCanadaPostStrikeEnabled = canadaPostStrikeConfiguration.isCanadaPostStrikeEnabled;
        const maxDaysInTransit = +canadaPostStrikeConfiguration.maxDaysInTransit || 0;
        const isCanada = orderLocale === CA;

        const daysInTransit = getDaysInTransit(shippingGroup);
        const notImpactedByPostalStrike = daysInTransit < maxDaysInTransit;
        const sid = notImpactedByPostalStrike ? NOT_IMPACTED : DELAYED;
        const banner = middleZone?.find(el => el.sid === sid && el.type === COMPONENT_TYPES.BANNER);

        const shouldRender = isCanadaPostStrikeEnabled && isCanada && !!banner;

        return {
            shouldRender,
            banner
        };
    }
);

const withCanadaPostStrikeCheckoutMessageProps = wrapHOC(connect(fields, null));

export {
    fields, withCanadaPostStrikeCheckoutMessageProps
};
