import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import localeUtils from 'utils/LanguageLocale';
import ProductList from 'components/Content/ProductList';
import contentConstants from 'constants/content';

const { PRODUCT_LIST_GROUPING, PRODUCT_LIST_VARIANTS } = contentConstants;

const getText = localeUtils.getLocaleResourceFile('components/CreditCard/ApplyFlow/ApplyCreditCardLoves/locales', 'ApplyCreditCardLoves');

const ApplyCreditCardLoves = props => {
    const loves = props.loves || [];

    return loves.length > 0 ? (
        <div data-at={Sephora.debug.dataAt('product_carousel')}>
            <ProductList
                skuList={loves}
                marginBottom={5}
                marginTop={0}
                title={getText('shopFaves')}
                subtitle={getText('fromLovesList')}
                variant={PRODUCT_LIST_VARIANTS.HORIZONTAL_CAROUSEL}
                grouping={[
                    PRODUCT_LIST_GROUPING.SHOW_ADD_BUTTON,
                    PRODUCT_LIST_GROUPING.SHOW_PRICE,
                    PRODUCT_LIST_GROUPING.SHOW_RATING_WITH_TOTAL_COUNT
                ]}
                actionLabel={getText('viewAll')}
                action={{
                    targetUrl: '/shopping-list'
                }}
            />
        </div>
    ) : null;
};

export default wrapFunctionalComponent(ApplyCreditCardLoves, 'ApplyCreditCardLoves');
