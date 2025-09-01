import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import { getImageAltText } from 'utils/Accessibility';
import DeliveryFrequencyUtils from 'utils/DeliveryFrequency';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import dateUtils from 'utils/Date';

const { formatSavingAmountString } = DeliveryFrequencyUtils;
const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/GlobalModals/GetItSoonerAutoReplenModal/locales', 'GetItSoonerAutoReplenModal');

const fields = createSelector(
    (_state, ownProps) => ownProps.subscription,
    createStructuredSelector({
        title: getTextFromResource(getText, 'title'),
        mainHeader: getTextFromResource(getText, 'mainHeader'),
        cancel: getTextFromResource(getText, 'cancel'),
        itemText: getTextFromResource(getText, 'item'),
        qtyText: getTextFromResource(getText, 'qty'),
        notRated: getTextFromResource(getText, 'notRated'),
        oneReview: getTextFromResource(getText, 'oneReview'),
        addToBasket: getTextFromResource(getText, 'addToBasket'),
        yearlySavings: getTextFromResource(getText, 'yearlySavings'),
        nextShipmentBy: getTextFromResource(getText, 'nextShipmentBy')
    }),
    (subscription, textResources) => {
        const item = subscription?.items[0];
        const imageAltText = item && getImageAltText(item);
        const nextDeliveryDate = dateUtils.getPromiseDate(`${subscription.nextToNextScheduledRunDate}T00:00`);
        const discountPrice = formatSavingAmountString({
            replenishmentAdjuster: item?.discountAmount,
            replenishmentAdjusterPrice: item?.discountedPrice,
            replenishmentAdjusterType: item?.discountType
        });

        return {
            ...textResources,
            item,
            nextDeliveryDate,
            imageAltText,
            discountPrice
        };
    }
);

const withGetItSoonerAutoReplenModalProps = wrapHOC(connect(fields));

export { withGetItSoonerAutoReplenModalProps };
