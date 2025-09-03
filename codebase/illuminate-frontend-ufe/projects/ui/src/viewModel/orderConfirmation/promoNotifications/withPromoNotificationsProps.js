import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import basketUtils from 'utils/Basket';
import Empty from 'constants/empty';
import FrameworkUtils from 'utils/framework';
import basketSelector from 'selectors/basket/basketSelector';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import Location from 'utils/Location';

const { wrapHOC } = FrameworkUtils;
const withPromoNotificationsProps = wrapHOC(
    connect(
        createSelector(basketSelector, orderDetailsSelector, (basket, orderDetails) => {
            const basketMessages = basketUtils.isPickup() ? basket?.pickupBasket?.basketLevelMessages : basket?.basketLevelMessages;
            let notifications = ((Location.isOrderConfirmationPage() ? orderDetails?.items?.basketLevelMessages : basketMessages) || [])
                .filter(message =>
                    Location.isOrderConfirmationPage()
                        ? message.messageContext.includes('order.confirmation.promotion')
                        : message.messageContext.includes('basket.promotion')
                )
                .map(message => ({
                    text: message.messages[0],
                    isEmoticon: message.messageLogo.includes('emoticon:'),
                    icon: message.messageLogo.replace('emoticon:', ''),
                    isQualified: message.messageContext.includes('.qualified')
                }));

            if (notifications.length === 0) {
                notifications = Empty.Array;
            }

            return { notifications };
        })
    )
);

export { withPromoNotificationsProps };
