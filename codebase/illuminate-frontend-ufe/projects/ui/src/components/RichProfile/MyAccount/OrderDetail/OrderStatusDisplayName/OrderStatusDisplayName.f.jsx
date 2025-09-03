// eslint-disable-next-line no-unused-vars
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Text, Link, Box } from 'components/ui';
import { colors, space } from 'style/config';
import localeUtils from 'utils/LanguageLocale';

const getText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/OrderDetail/locales', 'OrderDetail');

function displayNameShouldBeGreenAndBold(orderStatusDisplayName) {
    return (
        // BOPIS
        orderStatusDisplayName === 'Processing' ||
        orderStatusDisplayName === 'Ready for Pickup' ||
        // Standard
        orderStatusDisplayName === 'Placed' ||
        orderStatusDisplayName === 'In Progress' ||
        orderStatusDisplayName === 'Shipped' ||
        // SDD
        orderStatusDisplayName === 'On Its Way' ||
        // FEDEX PICKUP LOCATION
        orderStatusDisplayName === 'Ready For Pickup' ||
        orderStatusDisplayName === 'Picked Up' ||
        orderStatusDisplayName === 'Not Picked Up, Return to Sephora' ||
        orderStatusDisplayName === 'Return to Sender' ||
        orderStatusDisplayName === 'Return to Sephora Initiated'
    );
}

function OrderStatusDisplayName({ orderStatus, orderStatusDisplayName, isOrderCanceled, showModal }) {
    const isGreenAndBold = displayNameShouldBeGreenAndBold(orderStatus);

    return (
        <Box>
            <Text
                data-at={Sephora.debug.dataAt('order_status')}
                is='p'
                color={isGreenAndBold && 'green'}
                fontWeight={isGreenAndBold && 'bold'}
                children={orderStatusDisplayName}
            />
            {isOrderCanceled ? (
                <React.Fragment>
                    <Link
                        onClick={showModal}
                        css={styles.faqsLink}
                    >
                        {getText('faqs')}
                    </Link>
                </React.Fragment>
            ) : null}
        </Box>
    );
}

const styles = {
    faqsLink: {
        color: colors.blue,
        margin: -space[2],
        padding: space[2],
        display: 'block'
    }
};

export default wrapFunctionalComponent(OrderStatusDisplayName, 'OrderStatusDisplayName');
