/* eslint-disable object-curly-newline */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import SinglePointView from 'components/Reward/LoyaltyPromo/SinglePointView';
import MultiplePointsView from 'components/Reward/LoyaltyPromo/MultiplePointsView';
import NoPointsView from 'components/Reward/LoyaltyPromo/NoPointsView';
import basketUtils from 'utils/Basket';
import promoUtils from 'utils/Promos';
import biUtils from 'utils/BiProfile';
import BasketConstants from 'constants/Basket';

const {
    CTA_TYPES: { CBR, PFD }
} = promoUtils;

const { CBR_PROMO_MESSAGE, PFD_PROMO_MESSAGE } = BasketConstants;

const LoyaltyViewType = {
    None: 'none',
    Single: 'single',
    Multiple: 'multiple',
    Unavailable: 'unavailable'
};

function createStateObject(basket, promo) {
    const error = promoUtils.extractError(promo, [CBR, PFD]);
    const errorMessage = error && error.errorMessages && error.errorMessages.length ? error.errorMessages.join(' ') : null;
    const errorPromoCode = error && error.promoCode ? error.promoCode.toLowerCase() : null;
    const cbrPromoMessage = basket.basketLevelMessages?.filter(message => message.messageContext === CBR_PROMO_MESSAGE).map(item => item.messages[0]);
    const pfdPromoMessage = basket.basketLevelMessages?.filter(message => message.messageContext === PFD_PROMO_MESSAGE).map(item => item.messages[0]);

    return {
        errorMessage,
        errorPromoCode,
        availableBiPoints: basket.availableBiPoints,
        cbr: {
            basketSubTotal: basket.subtotal,
            basketRawSubTotal: basket.rawSubTotal,
            availableRewardsTotal: basket.maxEligibleCBR,
            appliedRewardsTotal: basket.appliedCBRValue,
            promotions: Array.isArray(basket.availableCBRPromotions) ? basket.availableCBRPromotions : [],
            isBIPointsAvailable: basket.isBIPointsAvailable,
            promoMessage: cbrPromoMessage
        },
        pfd: {
            promotions: basket.availablePFDPromotions || [],
            availableRewardsTotal: basket.maxEligiblePercentageOff,
            appliedPercentageOff: basket.appliedPercentageOff,
            promoEndDate: basket.pfdPromoEndDate,
            promoMessage: pfdPromoMessage
        }
    };
}

class LoyaltyPromo extends BaseClass {
    constructor(props) {
        super(props);

        const { basket, promo } = this.props;
        const basketData = basketUtils.getCurrentBasketData({ basket });
        this.state = createStateObject(basketData, promo);
    }

    update = () => {
        const { basket, promo } = this.props;
        const basketData = basketUtils.getCurrentBasketData({ basket });
        const newState = createStateObject(basketData, promo);
        this.setState(newState);
    };

    componentDidMount() {
        this.update();
    }

    componentDidUpdate(prevProps) {
        if (this.props.basket !== prevProps.basket || this.props.promo !== prevProps.promo) {
            this.update();
        }
    }

    render() {
        const mode = this.getLoyaltyViewType();

        switch (mode) {
            case LoyaltyViewType.None: {
                return null;
            }
            case LoyaltyViewType.Single: {
                return <SinglePointView {...this.getSinglePointViewProps()} />;
            }
            case LoyaltyViewType.Multiple: {
                return <MultiplePointsView {...this.getMultiplePointsViewProps()} />;
            }
            default: {
                return <NoPointsView isCarousel={this.props.isCarousel} />;
            }
        }
    }

    getLoyaltyViewType = () => {
        const { cbr, pfd } = this.state;
        const single = cbr.isBIPointsAvailable && cbr.promotions.length === 1 && pfd.promotions.length === 0;
        const hasNoPromotions = !(cbr.promotions.length || pfd.promotions.length);
        const { isBopis } = this.props;
        let viewType;

        if (isBopis && !biUtils.isBIDataAvailable()) {
            viewType = LoyaltyViewType.Unavailable;
            // no CBR for ROW users (ILLUPH-135613)
        } else if (hasNoPromotions || !basketUtils.isUSorCanadaShipping()) {
            viewType = LoyaltyViewType.None;
        } else if (single) {
            viewType = LoyaltyViewType.Single;
        } else if (cbr.isBIPointsAvailable) {
            viewType = LoyaltyViewType.Multiple;
        } else {
            viewType = LoyaltyViewType.Unavailable;
        }

        return viewType;
    };

    getSinglePointViewProps = () => {
        const { isModal, isCarousel, isCheckout, isBopis, cmsInfoModals } = this.props;
        const {
            cbr: { promotions, availableRewardsTotal, promoMessage },
            pfd,
            errorMessage,
            errorPromoCode,
            availableBiPoints
        } = this.state;

        return {
            isCarousel,
            isCheckout,
            isModal,
            isBopis,
            availableBiPoints,
            cbr: {
                promotions,
                availableRewardsTotal,
                promoMessage
            },
            pfd,
            cmsInfoModals,
            errorMessage,
            errorPromoCode
        };
    };

    getMultiplePointsViewProps = () => {
        const { forceCollapse, isCarousel, isCheckout, isCollapsible, isHeaderOnly, isModal, isBopis, onExpand, cmsInfoModals } = this.props;
        const {
            cbr: { appliedRewardsTotal, availableRewardsTotal, basketSubTotal, basketRawSubTotal, promotions, promoMessage },
            pfd,
            errorMessage,
            errorPromoCode,
            availableBiPoints
        } = this.state;

        return {
            forceCollapse,
            isCarousel,
            isCheckout,
            isCollapsible,
            isHeaderOnly,
            isModal,
            isBopis,
            onExpand,
            availableBiPoints,
            cbr: {
                promotions,
                appliedRewardsTotal,
                availableRewardsTotal,
                basketSubTotal,
                basketRawSubTotal,
                promoMessage
            },
            cmsInfoModals,
            pfd,
            errorMessage,
            errorPromoCode
        };
    };
}

export default wrapComponent(LoyaltyPromo, 'LoyaltyPromo', true);
