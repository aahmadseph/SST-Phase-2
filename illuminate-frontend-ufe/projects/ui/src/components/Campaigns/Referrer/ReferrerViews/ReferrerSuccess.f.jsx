/* eslint-disable object-curly-newline */
import React from 'react';
import { Box, Text, Button, Divider } from 'components/ui';
import Barcode from 'components/Barcode/Barcode';
import { wrapFunctionalComponent } from 'utils/framework';
import anaConsts from 'analytics/constants';
import userUtils from 'utils/User';
import languageLocaleUtils from 'utils/LanguageLocale';

const { getLocaleResourceFile } = languageLocaleUtils;
const getText = getLocaleResourceFile('components/Campaigns/Referrer/locales', 'Referrer');

function ReferrerSuccess({
    referrerText,
    referrerFirstName,
    successMessage,
    redemptionInstructions,
    discountDescription,
    startDate = '',
    expirationDate,
    offerText,
    couponCode,
    promoDisclaimer,
    handleShopNowClick
}) {
    const isDesktop = Sephora.isDesktop();
    digitalData.page.pageInfo.pageName = anaConsts.PAGE_NAMES.ADV_CAMPAIGNS;
    digitalData.page.category.pageType = anaConsts.PAGE_TYPES.ADV_REFERRER;

    return (
        <Box
            marginX='auto'
            marginTop={isDesktop ? 6 : 5}
            maxWidth={500}
        >
            <Text
                is='p'
                fontSize='md'
                lineHeight='tight'
                data-at={Sephora.debug.dataAt('referrer_text')}
                textAlign={isDesktop && 'center'}
                children={`${referrerText} ${referrerFirstName}`}
            />
            <Text
                is='h1'
                textAlign={isDesktop && 'center'}
                fontWeight='bold'
                lineHeight='tight'
                fontSize='3xl'
                marginY={5}
            >
                <span data-at={Sephora.debug.dataAt('client_firstname_success_message')}>{userUtils.getProfileFirstName()}</span>
                <span>{successMessage}</span>
            </Text>
            <Text
                is='p'
                data-at={Sephora.debug.dataAt('redemption_instructions')}
                textAlign={isDesktop && 'center'}
                marginBottom={5}
                children={redemptionInstructions}
            />
            <Box
                marginY={5}
                lineHeight='tight'
                textAlign='center'
            >
                <Text
                    is='h2'
                    fontWeight='bold'
                    data-at={Sephora.debug.dataAt('promo_discount')}
                    fontSize='3xl'
                    children={discountDescription}
                />
                <Text
                    is='p'
                    fontSize='sm'
                    marginTop='.125em'
                    children={getText('yourPurchase')}
                ></Text>
                <Text
                    is='p'
                    fontSize='sm'
                    marginTop='.625em'
                    marginBottom={5}
                >
                    <span>{getText('valid')}</span> <span data-at={Sephora.debug.dataAt('promo_start_date')}>{startDate}</span>
                    {' - '}
                    <span data-at={Sephora.debug.dataAt('promo_end_date')}>{expirationDate}</span>
                </Text>
                <Text
                    is='p'
                    marginBottom={4}
                    fontSize='md'
                >
                    <span data-at={Sephora.debug.dataAt('promo_offer_text')}>{offerText}</span>{' '}
                    <span data-at={Sephora.debug.dataAt('promo_coupon_code')}>
                        <strong>{couponCode}</strong>
                    </span>
                </Text>
                <Barcode
                    barcodeDataAt='promo_barcode'
                    code={'CODE39'}
                    id={couponCode}
                />
                <Button
                    marginTop={5}
                    variant='primary'
                    block={!isDesktop}
                    data-at={Sephora.debug.dataAt('shop_now_btn')}
                    hasMinWidth={isDesktop}
                    onClick={handleShopNowClick}
                    children={getText('shopNow')}
                />
            </Box>
            <Divider marginBottom={4} />
            <Text
                is='p'
                fontSize='sm'
                lineHeight='tight'
                data-at={Sephora.debug.dataAt('promo_disclaimer')}
                color='gray'
                children={promoDisclaimer}
            />
        </Box>
    );
}

export default wrapFunctionalComponent(ReferrerSuccess, 'ReferrerSuccess');
