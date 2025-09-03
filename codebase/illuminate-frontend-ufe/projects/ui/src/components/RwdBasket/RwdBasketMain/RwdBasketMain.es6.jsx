/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import * as rwdBasketCostants from 'constants/RwdBasket';
import RwdBasketLayout from 'components/RwdBasket/RwdBasketLayout/RwdBasketLayout';
import localeUtils from 'utils/LanguageLocale';
import SetPageAnalyticsProps from 'components/Analytics';
import anaConsts from 'analytics/constants';

const {
    MAIN_BASKET_TYPES: { BOPIS_BASKET, DC_BASKET }
} = rwdBasketCostants;

const getText = localeUtils.getLocaleResourceFile('components/RwdBasket/RwdBasketMain/locales', 'RwdBasketMain');

class RwdBasketMain extends BaseClass {
    constructor(props) {
        super(props);

        this.basketSwitchCallbacks = ({ bopisItems, saDItems }) => ({
            [BOPIS_BASKET]: () => props.goToDCBasket({ prop55: anaConsts.LinkData.BASKET_SWITCH_SAD, items: saDItems }),
            [DC_BASKET]: () => props.goToPickUpBasket({ prop55: anaConsts.LinkData.BASKET_SWITCH_BOPIS, items: bopisItems })
        });

        this.pageAnalytics = {
            [BOPIS_BASKET]: {
                pageType: anaConsts.PAGE_TYPES.BASKET,
                pageName: anaConsts.PAGE_NAMES.BOPIS_BASKET
            },
            [DC_BASKET]: {
                pageType: anaConsts.PAGE_TYPES.BASKET,
                pageName: anaConsts.PAGE_NAMES.BASKET
            }
        };
    }

    getTitle({ basketType, totalShippingItems, totalBopisItems }) {
        return basketType === BOPIS_BASKET ? getText('bopisTitle', [totalBopisItems]) : getText('shippingTitle', [totalShippingItems]);
    }

    getBasketSwitchLabel({ basketType }) {
        return getText(basketType === BOPIS_BASKET ? 'basketSwitchShipping' : 'basketSwitchBOPIS');
    }

    refreshBasketClick = () => {
        this.props.refreshBasket();
    };

    onBasketSwitch(cartInfo) {
        if (!this.props.isPreBasketAvailable) {
            return null;
        }

        const onBasketSwitch = this.basketSwitchCallbacks({
            bopisItems: cartInfo.getAllBOPISItems(),
            saDItems: cartInfo.getAllSaDItems()
        })[this.props.basketType];

        if (onBasketSwitch == null) {
            throw new Error('onBasketSwitch requires valid props.basketType from MAIN_BASKET_TYPES');
        }

        return onBasketSwitch;
    }

    goToPickUpBasket() {
        return this.props.isPreBasketAvailable && this.props.goToPreBasket;
    }

    render() {
        const {
            basketType,
            cartInfo,
            cartComponentLists,
            paymentInfo,
            messageInfo,
            biBenefitsInfo,
            giftCardInfo,
            topContentMessageComponentList,
            bottomContentComponentList,
            hasSubstituteItemsInSameDayAndBopis,
            swapGiftCardBiBenefitBasket,
            showBasketGreyBackground,
            showMoveBasketCheckoutButton
        } = this.props;

        return (
            <>
                <SetPageAnalyticsProps {...this.pageAnalytics[basketType]} />
                <RwdBasketLayout
                    title={this.getTitle({
                        basketType,
                        totalShippingItems: cartInfo.getTotalItemsShippingBaskets(),
                        totalBopisItems: cartInfo.getTotalItemsBopisBaskets()
                    })}
                    basketSwitchLabel={this.getBasketSwitchLabel({ basketType })}
                    onBasketSwitch={this.onBasketSwitch(cartInfo)}
                    goToPreBasket={this.goToPickUpBasket()}
                    cartSections={cartComponentLists[basketType]}
                    paymentInfo={paymentInfo[basketType]}
                    messageInfo={messageInfo[basketType]}
                    biBenefitsInfo={biBenefitsInfo[basketType]}
                    giftCardInfo={giftCardInfo[basketType]}
                    sedClosePromoMessages={cartInfo?.sedClosePromoMessages}
                    promoErrorMessages={cartInfo?.promo?.promoError}
                    topContentMessageComponentList={topContentMessageComponentList[basketType]}
                    bottomContentComponentList={bottomContentComponentList[basketType]}
                    hasSubstituteItemsInSameDayAndBopis={hasSubstituteItemsInSameDayAndBopis}
                    refreshBasketClick={this.refreshBasketClick}
                    swapGiftCardBiBenefitBasket={swapGiftCardBiBenefitBasket}
                    showBasketGreyBackground={showBasketGreyBackground}
                    basketType={basketType} //TS-3142 - showApplyPointsForBazaarItems
                    showMoveBasketCheckoutButton={showMoveBasketCheckoutButton}
                />
            </>
        );
    }
}

export default wrapComponent(RwdBasketMain, 'RwdBasketMain');
