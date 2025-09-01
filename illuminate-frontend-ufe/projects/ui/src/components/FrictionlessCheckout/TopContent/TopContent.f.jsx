import React from 'react';
import orderUtils from 'utils/Order';
import { wrapFunctionalComponent } from 'utils/framework';
import { Flex } from 'components/ui';
import TopContentMessage from 'components/RwdBasket/RwdBasketLayout/TopContentMessages/TopContentMessage';
import TopPageCMSBannerMessage from 'components/RwdBasket/RwdBasketLayout/TopContentMessages/TopPageCMSBannerMessage';
import * as RwdBasketConst from 'constants/RwdBasket';
import constants from 'constants/content';

const {
    TOP_BANNER_MESSAGES: { FREE_RETURNS }
} = RwdBasketConst;

const {
    COMPONENT_TYPES: { BANNER }
} = constants;

function TopContent({ content = [], localization, isZeroCheckout, isShippableOrder }) {
    const getContentfulBanners = () => {
        return content.reduce((acc, obj) => {
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
    };

    const getHardcodedBanners = () => {
        const banners = [];

        banners.push(
            <TopContentMessage
                messageKey={FREE_RETURNS}
                icon='box'
                message={localization.freeReturns}
            />
        );

        return banners;
    };

    const getZeroPaymentText = () => {
        if (isZeroCheckout) {
            let reviewOrderText;

            if (orderUtils.isZeroDollarOrderWithCVVValidation() && !isShippableOrder) {
                reviewOrderText = localization.verifyCVVeFulfilledOrder;
            } else if (orderUtils.isZeroDollarOrderWithCVVValidation()) {
                reviewOrderText = localization.verifyCVV;
            } else {
                reviewOrderText = localization.noPaymentRequired;
            }

            return (
                <Flex
                    flexDirection='row'
                    justifyContent='flex-start'
                    alignItems='baseline'
                    gap={3}
                    width='100%'
                    p={4}
                    backgroundColor='nearWhite'
                >
                    {reviewOrderText}
                </Flex>
            );
        }

        return null;
    };

    return (
        <>
            <Flex
                flexDirection='column'
                alignItems='flex-start'
                justifyContent='center'
                gap={2}
            >
                {content?.length > 0 && getContentfulBanners()}
                {!isZeroCheckout && getHardcodedBanners()}
                {getZeroPaymentText()}
            </Flex>
        </>
    );
}

export default wrapFunctionalComponent(TopContent, 'TopContent');
