import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Text, Box, Link, Flex
} from 'components/ui';
import stringUtils from 'utils/String';
import userUtils from 'utils/User';
import contentConstants from 'constants/content';
import ProductList from 'components/Content/ProductList';
import basketUtils from 'utils/Basket';
import AddToBasketButton from 'components/AddToBasketButton';
import localeUtils from 'utils/LanguageLocale';

const getText = localeUtils.getLocaleResourceFile('components/Content/BeautyInsider/BeautyInsiderModules/BirthdayGifts/locales', 'BirthdayGifts');

const ADD_BUTTON_TYPE = basketUtils.ADD_TO_BASKET_TYPES;
const { PRODUCT_LIST_GROUPING, PRODUCT_LIST_VARIANTS } = contentConstants;
const { embedHTML } = stringUtils;

const renderBiButton = ({ analyticsContext, rootContainerName, sku }) => {
    return (
        <Box
            marginTop='auto'
            paddingTop={3}
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
    );
};

const getTranslatedDaysToRedeem = () => {
    const lastDateToRedeem = userUtils.getGiftLastDateToRedeem();

    if (!localeUtils.isFrench()) {
        return lastDateToRedeem;
    }

    const daysLeft = lastDateToRedeem.match(/\d+/);

    return daysLeft ? getText('daysToRedeem', [daysLeft[0]]) : null;
};

const BirthdayGifts = ({ items, userName }) => {
    const innerText = embedHTML(/(\d+)/, getTranslatedDaysToRedeem() || '', 'b');
    items.forEach(item => {
        item.listPrice = 'birthday gift';
    });

    return (
        <Box marginTop={[6, 7]}>
            <Text
                is='h3'
                color='gray'
                fontSize={['base', 'md']}
                fontWeight='bold'
                children={`${getText('happyBday')}, ${userName}!`}
            />
            <Text
                is='h2'
                fontSize={['md', 'lg']}
                fontWeight='bold'
                children={getText('chooseGift')}
            />
            <div
                data-at={Sephora.debug.dataAt('product_carousel_second_subtitle')}
                dangerouslySetInnerHTML={{
                    __html: innerText
                }}
            />
            <Flex justifyContent='flex-end'>
                <Link
                    padding={2}
                    margin={-2}
                    color='blue'
                    underline={true}
                    target='_blank'
                    href='/beauty/birthday-gift'
                    children={getText('viewAll')}
                />
            </Flex>
            <ProductList
                skuList={items}
                variant={PRODUCT_LIST_VARIANTS.SMALL_CAROUSEL}
                isBIRBReward={true}
                isBirthDayRewardList={true}
                renderBiButton={renderBiButton}
                isShortButton={true}
                showAddButton={true}
                grouping={[PRODUCT_LIST_GROUPING.SHOW_ADD_BUTTON, PRODUCT_LIST_GROUPING.SHOW_PRICE, PRODUCT_LIST_GROUPING.SHOW_MARKETING_FLAGS]}
                marginBottom={0}
                marginTop={4}
                isRewardProductList={true}
            />
        </Box>
    );
};

export default wrapFunctionalComponent(BirthdayGifts, 'BirthdayGifts');
