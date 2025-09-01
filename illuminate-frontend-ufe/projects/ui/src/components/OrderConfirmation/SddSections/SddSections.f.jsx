import { Divider } from 'components/ui';
import {
    borders, mediaQueries, space, colors
} from 'style/config';
import DeliverToSection from 'components/OrderConfirmation/SddSections/DeliverToSection';
import DeliveryBySection from 'components/OrderConfirmation/SddSections/DeliveryBySection';
import OrderTotal from 'components/OrderConfirmation/OrderTotal';
import React from 'react';
import PropTypes from 'prop-types';
import SddSection from 'components/OrderConfirmation/SddSections/SddSection';
import StandardSection from 'components/OrderConfirmation/SddSections/StandardSection';
import { wrapFunctionalComponent } from 'utils/framework';
import SmsOptInBanner from 'components/SmsOptInBanner';

const SddSections = ({
    hasSingleShippingGroupForStandardItems,
    hasStandardItems,
    orderDetailsLink,
    orderLocale,
    priceInfo,
    isSDUOrderOnly,
    showSDUBISection,
    isSameDayOrder,
    promiseDateRangeLabel,
    promiseDateRange,
    biInfo,
    shouldRenderStandard
}) => (
    <>
        <Divider css={styles.divider} />
        {!isSDUOrderOnly && <DeliverToSection />}
        {promiseDateRange && (
            <DeliveryBySection
                promiseDateRangeLabel={promiseDateRangeLabel}
                promiseDateRange={promiseDateRange}
            />
        )}
        {!isSDUOrderOnly && <SmsOptInBanner displayDivider />}
        {!isSDUOrderOnly && <Divider css={hasStandardItems ? styles.blackDivider : styles.divider} />}
        <SddSection
            orderDetailsLink={orderDetailsLink}
            showTotals={!hasSingleShippingGroupForStandardItems}
            isSDUOrderOnly={isSDUOrderOnly}
            isSameDayOrder={isSameDayOrder}
            biInfo={biInfo}
        />
        {shouldRenderStandard && hasStandardItems && !isSDUOrderOnly && (
            <>
                <StandardSection
                    orderDetailsLink={orderDetailsLink}
                    showTotals={!hasSingleShippingGroupForStandardItems}
                    hasStandardItems={hasStandardItems}
                />
            </>
        )}
        {hasSingleShippingGroupForStandardItems && (
            <>
                <Divider css={styles.totalsDivider} />
                <OrderTotal
                    orderLocale={orderLocale}
                    priceInfo={priceInfo}
                    ssdOrder
                    useEstimatedLabelForOrderTotal={true}
                    isSDUOrderOnly={isSDUOrderOnly}
                    showSDUBISection={showSDUBISection}
                />
            </>
        )}
    </>
);

const styles = {
    divider: {
        border: borders[0],
        borderTop: `${borders[3]} ${colors.nearWhite}`,
        margin: `${space[4]}px -${space[4]}px`,
        [mediaQueries.md]: {
            border: `${borders[1]} ${colors.nearWhite}`,
            margin: `${space[5]}px 0`
        }
    },
    blackDivider: {
        border: borders[0],
        borderTop: `${borders[3]} ${colors.nearWhite}`,
        margin: `${space[4]}px -${space[4]}px`,
        [mediaQueries.md]: {
            border: `${borders[1]} ${colors.black}`,
            margin: `${space[5]}px 0`
        }
    },
    totalsDivider: {
        border: `${borders[1]} ${colors.nearWhite}`,
        margin: `${space[5]}px 0`
    }
};

SddSections.defaultProps = {
    isSameDayOrder: false,
    shouldRenderStandard: true
};
SddSections.propTypes = {
    hasSingleShippingGroupForStandardItems: PropTypes.bool.isRequired,
    hasStandardItems: PropTypes.bool.isRequired,
    orderDetailsLink: PropTypes.string.isRequired,
    orderLocale: PropTypes.string.isRequired,
    priceInfo: PropTypes.object.isRequired,
    isSameDayOrder: PropTypes.bool,
    shouldRenderStandard: PropTypes.bool
};

export default wrapFunctionalComponent(SddSections, 'SddSections');
