import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import store from 'store/Store';
import Actions from 'Actions';
import { Button, Flex } from 'components/ui';
import BiFreeShipping from 'components/RwdBasket/Messages/BiFreeShipping/BiFreeShipping';
import TopContentLayout from 'components/RwdBasket/RwdBasketLayout/TopContentMessages/TopContentLayout';

import { fontSizes } from 'style/config';

import auth from 'utils/Authentication';
import localeUtils from 'utils/LanguageLocale';
import { HEADER_VALUE } from 'constants/authentication';

function signInHandler(e, anaData) {
    e.stopPropagation();
    auth.requireAuthentication(null, null, anaData, null, false, HEADER_VALUE.USER_CLICK).catch(() => {});
}

function joinNowHandler(e) {
    e.stopPropagation();
    try {
        store.dispatch(Actions.showBiRegisterModal({ isOpen: true }));
    } catch (error) {
        Sephora.logger.verbose(error);
    }
}

const getText = localeUtils.getLocaleResourceFile('components/RwdBasket/RwdBasketLayout/TopContentMessages/locales', 'TopContentFreeShipping');

function TopContentFreeShipping({
    isBIUser,
    isSignedIn,
    backgroundColor,
    showBasketGreyBackground,
    potentialBeautyBankPoints,
    showBasketShippingAndPoints
}) {
    return (
        <TopContentLayout
            backgroundColor={backgroundColor}
            showBasketGreyBackground={showBasketGreyBackground}
        >
            <Flex
                justifyContent={'space-between'}
                alignItems={'center'}
                width={'100%'}
            >
                {/* This message is only displayed for anonymous users so we can hard code the props */}
                <BiFreeShipping
                    isSignedInBIUser={false}
                    hasMetFreeShippingThreshhold={false}
                    isFreeShipBold
                    potentialBeautyBankPoints={potentialBeautyBankPoints}
                    showBasketShippingAndPoints={showBasketShippingAndPoints}
                />
                <Button
                    display={'inline-flex'}
                    variant='primary'
                    hasMinWidth={false}
                    onClick={isSignedIn && !isBIUser ? joinNowHandler : signInHandler}
                    height={'32px'}
                    minHeight={'32px'}
                    minWidth={'110px'}
                    marginLeft={3}
                    css={{
                        fontSize: fontSizes.sm,
                        textTransform: 'capitalize'
                    }}
                >
                    {getText(isSignedIn && !isBIUser ? 'joinNowText' : 'signInText')}
                </Button>
            </Flex>
        </TopContentLayout>
    );
}

export default wrapFunctionalComponent(TopContentFreeShipping, 'TopContentFreeShipping');
