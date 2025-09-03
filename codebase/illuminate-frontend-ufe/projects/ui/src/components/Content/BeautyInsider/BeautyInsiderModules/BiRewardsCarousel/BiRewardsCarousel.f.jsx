import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Text, Box } from 'components/ui';
import contentConstants from 'constants/content';
import ProductList from 'components/Content/ProductList';
import localeUtils from 'utils/LanguageLocale';
import basketUtils from 'utils/Basket';
import AddToBasketButton from 'components/AddToBasketButton';
import rougeExclusiveUtils from 'utils/rougeExclusive';

const getText = localeUtils.getLocaleResourceFile(
    'components/Content/BeautyInsider/BeautyInsiderModules/BiRewardsCarousel/locales',
    'BiRewardsCarousel'
);

const ADD_BUTTON_TYPE = basketUtils.ADD_TO_BASKET_TYPES;
const { PRODUCT_LIST_GROUPING, PRODUCT_LIST_VARIANTS } = contentConstants;

const renderBiButton = ({ analyticsContext, rootContainerName, sku }) => {
    return (
        <Box marginTop={2}>
            {sku.biType && <Text fontWeight='bold'>{sku.biType.toLowerCase()}</Text>}
            <Box
                display='block'
                marginTop={[2, 3]}
            >
                <AddToBasketButton
                    isRewardItem
                    sku={sku}
                    variant={ADD_BUTTON_TYPE.SECONDARY}
                    isAddButton={true}
                    size='sm'
                    analyticsContext={analyticsContext}
                    rootContainerName={rootContainerName}
                    onlyUseTextProp={getText('add')}
                />
            </Box>
        </Box>
    );
};

const BiRewardsCarousel = ({ items, showOmniRewardsNotice }) => {
    items.forEach(item => {
        delete item.variationValue;
    });

    const title = rougeExclusiveUtils.isRougeExclusive() ? getText('titleRouge') : getText('title');
    const subtitle = showOmniRewardsNotice && getText('omniRewardsNotice');

    return (
        <Box marginTop={[6, 7]}>
            <ProductList
                skuList={items}
                variant={PRODUCT_LIST_VARIANTS.SMALL_CAROUSEL}
                isBIRBReward={true}
                isShortButton={true}
                showAddButton={true}
                title={title}
                subtitle={subtitle}
                action={{
                    targetUrl: '/rewards'
                }}
                actionLabel={getText('viewAll')}
                grouping={[PRODUCT_LIST_GROUPING.SHOW_MARKETING_FLAGS, PRODUCT_LIST_GROUPING.SHOW_RATING_WITH_TOTAL_COUNT]}
                renderBiButton={renderBiButton}
                marginBottom={0}
                rougeBadgeText={getText('rougeBadge')}
            />
        </Box>
    );
};

export default wrapFunctionalComponent(BiRewardsCarousel, 'BiRewardsCarousel');
