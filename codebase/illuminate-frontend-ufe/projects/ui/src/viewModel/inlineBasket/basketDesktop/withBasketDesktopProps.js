import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { isAnonymousSelector } from 'selectors/auth/isAnonymousSelector';
import basketSelector from 'selectors/basket/basketSelector';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/InlineBasket/BasketDesktop/locales', 'BasketDesktop');

export default connect(
    createStructuredSelector({
        isAnonymous: isAnonymousSelector,
        basket: basketSelector,
        localization: createStructuredSelector({
            signIn: getTextFromResource(getText, 'signIn'),
            sigInToSeeItems: getTextFromResource(getText, 'sigInToSeeItems'),
            seeSamplesRewardsPromotions: getTextFromResource(getText, 'seeSamplesRewardsPromotions'),
            basket: getTextFromResource(getText, 'basket'),
            dcTotal: getTextFromResource(getText, 'dcTotal'),
            basketTotal: getTextFromResource(getText, 'basketTotal'),
            reserveTotal: getTextFromResource(getText, 'reserveTotal'),
            bopisTotal: getTextFromResource(getText, 'bopisTotal'),
            checkout: getTextFromResource(getText, 'checkout'),
            emptyBasket: getTextFromResource(getText, 'emptyBasket'),
            or: getTextFromResource(getText, 'or'),
            shopNewArrivals: getTextFromResource(getText, 'shopNewArrivals'),
            viewAll: getTextFromResource(getText, 'viewAll'),
            freeShipping: getTextFromResource(getText, 'freeShipping'),
            createAccount: getTextFromResource(getText, 'createAccount'),
            sameDayDelivery: getTextFromResource(getText, 'sameDayDelivery'),
            standardDelivery: getTextFromResource(getText, 'standardDelivery'),
            item: getTextFromResource(getText, 'item'),
            basketHeader: getTextFromResource(getText, 'basketHeader'),
            reserveHeader: getTextFromResource(getText, 'reserveHeader'),
            bopisHeader: getTextFromResource(getText, 'bopisHeader')
        })
    })
);
