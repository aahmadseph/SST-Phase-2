import React from 'react';

import TopContentFreeShipping from 'components/RwdBasket/RwdBasketLayout/TopContentMessages/TopContentFreeShipping';
import TopPageCMSBannerMessage from 'components/RwdBasket/RwdBasketLayout/TopContentMessages/TopPageCMSBannerMessage';
import TopContentBBQMessage from 'components/RwdBasket/RwdBasketLayout/TopContentMessages/TopContentBBQMessage';
import TopContentMessage from 'components/RwdBasket/RwdBasketLayout/TopContentMessages/TopContentMessage';
import TopContentBirthdayMessage from 'components/RwdBasket/RwdBasketLayout/TopContentMessages/TopContentBirthdayMessage';
import TopContentCanadaPostStrikeMessage from 'components/RwdBasket/RwdBasketLayout/TopContentMessages/TopContentCanadaPostStrikeMessage';
import localeUtils from 'utils/LanguageLocale';
import * as RwdBasketConst from 'constants/RwdBasket';
import constants from 'constants/content';
const {
    MAIN_BASKET_TYPES: { DC_BASKET, BOPIS_BASKET },
    TOP_BANNER_MESSAGES: { FREE_RETURNS, TIER, CANADA_POST_STRIKE },
    TOP_BANNER_PERSONALIZED_MESSAGES
} = RwdBasketConst;
const getText = localeUtils.getLocaleResourceFile('components/RwdBasket/RwdBasketLayout/TopContentMessages/locales', 'TopContentFreeReturns');

const {
    COMPONENT_TYPES: { BANNER }
} = constants;

function getCMSComponentList(content) {
    return content.reduce((acc, obj) => {
        if (obj.sid === TOP_BANNER_PERSONALIZED_MESSAGES.BIRTHDAY_GIFT) {
            acc.push(
                <TopContentBirthdayMessage
                    {...obj}
                    key={obj.sid}
                />
            );

            return acc;
        }

        if (obj.sid === CANADA_POST_STRIKE) {
            acc.push(
                <TopContentCanadaPostStrikeMessage
                    {...obj}
                    icon={obj.media?.src}
                    key={obj.sid}
                />
            );

            return acc;
        }

        if (obj.type === BANNER && obj.text) {
            acc.push(
                <TopPageCMSBannerMessage
                    key={obj.sid}
                    text={obj.text}
                    targetUrl={obj.action?.targetUrl}
                    icon={obj.media?.src}
                />
            );
        }

        return acc;
    }, []);
}

// INFL-4194 / INFL-4195 stipulated ordering
function getOrderedTopContentComponentList({
    isSignedIn,
    isBIUser,
    basketLevelMessages = [],
    realTimeVIBMessages,
    cmsZone,
    potentialBeautyBankPoints = 0,
    showBasketShippingAndPoints = false
}) {
    const out = [];

    if ((isSignedIn && !isBIUser) || !isSignedIn) {
        out.push(
            <TopContentFreeShipping
                isBIUser={isBIUser}
                isSignedIn={isSignedIn}
                potentialBeautyBankPoints={potentialBeautyBankPoints}
                showBasketShippingAndPoints={showBasketShippingAndPoints}
            />
        );
    }

    out.push(...getCMSComponentList(cmsZone));

    const bbqMessage = basketLevelMessages.find(message => message.messageContext.includes('basket.promotion'));

    if (bbqMessage) {
        out.push(<TopContentBBQMessage {...bbqMessage} />);
    }

    const tierMessage = realTimeVIBMessages?.[0];

    if (tierMessage) {
        out.push(
            <TopContentMessage
                messageKey={TIER}
                icon='bell'
                message={tierMessage}
            />
        );
    }

    out.push(
        <TopContentMessage
            messageKey={FREE_RETURNS}
            icon='box'
            message={getText('freeReturns')}
        />
    );

    return out;
}

function getTopContentMessageComponentList({
    basket: { basketLevelMessages, realTimeVIBMessages, pickupBasket, potentialBeautyBankPoints = 0 },
    user: { isSignedIn, isBIUser },
    cmsData: { topContent = [], bopisTopContent = [] } = {},
    showBasketShippingAndPoints
}) {
    const saDMessages = getOrderedTopContentComponentList({
        basketLevelMessages,
        realTimeVIBMessages,
        isSignedIn,
        isBIUser,
        cmsZone: topContent,
        potentialBeautyBankPoints,
        showBasketShippingAndPoints
    });

    const bopisMessages = getOrderedTopContentComponentList({
        basketLevelMessages: pickupBasket?.basketLevelMessages,
        realTimeVIBMessages: pickupBasket?.realTimeVIBMessages,
        isSignedIn,
        isBIUser,
        cmsZone: bopisTopContent
    });

    return {
        [DC_BASKET]: {
            isAvailable: saDMessages.length > 0,
            messages: saDMessages
        },
        [BOPIS_BASKET]: {
            isAvailable: bopisMessages.length > 0,
            messages: bopisMessages
        }
    };
}

export { getTopContentMessageComponentList };
