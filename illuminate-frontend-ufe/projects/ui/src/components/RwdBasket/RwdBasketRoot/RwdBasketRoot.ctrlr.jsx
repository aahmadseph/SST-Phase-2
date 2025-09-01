import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import RwdBasketMain from 'components/RwdBasket/RwdBasketMain/RwdBasketMain';
import RwdPreBasket from 'components/RwdBasket/RwdPreBasket/RwdPreBasket';
import SetPageAnalyticsProps from 'components/Analytics';
import { ROOT_BASKET_TYPES } from 'constants/RwdBasket';
import anaConsts from 'analytics/constants';
import UI from 'utils/UI';

class RwdBasketRoot extends BaseClass {
    componentDidMount() {
        this.props.resetScrollToTop();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.currentMainBasketType !== this.props.currentMainBasketType) {
            this.props.resetScrollToTop();
        }
    }

    componentWillUnmount() {
        this.props.resetNavigation();
    }

    render() {
        const {
            currentRootBasketType,
            currentMainBasketType,
            goToPickUpBasket,
            goToDCBasket,
            goToPreBasket,
            cartInfo,
            cartComponentLists,
            paymentInfo,
            messageInfo,
            isPreBasketAvailable,
            shouldScrollToTop,
            biBenefitsInfo,
            giftCardInfo,
            topContentMessageComponentList,
            preBasketInfoModalCallbacks,
            bottomContentComponentList,
            isInitialized,
            refreshBasket,
            swapGiftCardBiBenefitBasket,
            showBasketGreyBackground,
            showMoveBasketCheckoutButton
        } = this.props;

        if (!isInitialized) {
            return null;
        }

        shouldScrollToTop && UI.scrollToTop();

        if (currentRootBasketType === ROOT_BASKET_TYPES.PRE_BASKET) {
            return (
                <>
                    <SetPageAnalyticsProps
                        pageType={anaConsts.PAGE_TYPES.BASKET}
                        pageName={anaConsts.PAGE_NAMES.PREBASKET}
                        world={null}
                    />
                    <RwdPreBasket
                        goToPickUpBasket={goToPickUpBasket}
                        goToDCBasket={goToDCBasket}
                        cartInfo={cartInfo}
                        paymentInfo={paymentInfo}
                        messageInfo={messageInfo[ROOT_BASKET_TYPES.PRE_BASKET]}
                        preBasketInfoModalCallbacks={preBasketInfoModalCallbacks}
                    />
                </>
            );
        }

        if (currentRootBasketType === ROOT_BASKET_TYPES.MAIN_BASKET) {
            // TODO get rid of RwdBasketMain and just switch between two instances of RwdBasketLayout
            return (
                <>
                    <SetPageAnalyticsProps
                        pageType={anaConsts.PAGE_TYPES.BASKET}
                        pageName={anaConsts.PAGE_NAMES.BASKET}
                    />
                    <RwdBasketMain
                        goToPickUpBasket={goToPickUpBasket}
                        goToDCBasket={goToDCBasket}
                        goToPreBasket={goToPreBasket}
                        cartComponentLists={cartComponentLists}
                        basketType={currentMainBasketType}
                        isPreBasketAvailable={isPreBasketAvailable}
                        cartInfo={cartInfo}
                        paymentInfo={paymentInfo}
                        messageInfo={messageInfo[ROOT_BASKET_TYPES.MAIN_BASKET]}
                        topContentMessageComponentList={topContentMessageComponentList}
                        biBenefitsInfo={biBenefitsInfo}
                        giftCardInfo={giftCardInfo}
                        bottomContentComponentList={bottomContentComponentList}
                        refreshBasket={refreshBasket}
                        swapGiftCardBiBenefitBasket={swapGiftCardBiBenefitBasket}
                        showBasketGreyBackground={showBasketGreyBackground}
                        showMoveBasketCheckoutButton={showMoveBasketCheckoutButton}
                    />
                </>
            );
        }

        return null;
    }
}

export default wrapComponent(RwdBasketRoot, 'RwdBasketRoot', true);
