/* eslint-disable object-curly-newline */
import React from 'react';
import store from 'store/Store';
import Actions from 'Actions';
import Markdown from 'components/Markdown/Markdown';
import localeUtils from 'utils/LanguageLocale';
import PromoUtils from 'utils/Promos';
import BccUtils from 'utils/BCC';
import Location from 'utils/Location';

const { CTA_TYPES, applyPromo, removePromo } = PromoUtils;
const {
    MEDIA_IDS: { CASH_BACK_REWARDS_MODAL_CONTENT, POINTS_FOR_DISCOUNT_MODAL }
} = BccUtils;

const getEligibilityText = localeUtils.getLocaleResourceFile('components/Reward/LoyaltyPromo/locales', 'LoyaltyPromo');
const getTextForPointsForDiscount = localeUtils.getLocaleResourceFile(
    'components/RichProfile/BeautyInsider/PointsForDiscount/locales',
    'PointsForDiscount'
);
const getEligibility = (cbr, pfd) => {
    const localizedBiPointsAmount = localeUtils.getFormattedPrice(cbr.availableRewardsTotal, false, false);
    const noCbrPromo = cbr.promotions.length === 0;
    const hasOnlyOneCbrPromo = cbr.promotions.length === 1;
    const hasPfdPromo = pfd.promotions.length > 0;

    if (noCbrPromo) {
        return getEligibilityText('pfdPointsOnly', [pfd.availableRewardsTotal]);
    }

    if (hasOnlyOneCbrPromo) {
        const option = cbr.promotions[0];

        return hasPfdPromo
            ? getEligibilityText('singleCbrWithPfdPoints', [localizedBiPointsAmount, pfd.availableRewardsTotal])
            : getEligibilityText('singleCbrNoPfdPoints', [option.localizedDiscountAmount, option.points]);
    }

    // can only be multiple CBR promo
    return hasPfdPromo
        ? getEligibilityText('manyCbrWithPfdPoints', [localizedBiPointsAmount, pfd.availableRewardsTotal])
        : getEligibilityText('cbrPointsOnly', [localizedBiPointsAmount]);
};

const cbrOnInfoClick = (event, cmsConfig) => {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    const { isContentfulBasketEnabled } = Sephora.configurationSettings;

    if (isContentfulBasketEnabled && !Location.isCheckout()) {
        store.dispatch(
            Actions.showContentModal({
                isOpen: true,
                data: cmsConfig
            })
        );
    } else {
        store.dispatch(
            Actions.showMediaModal({
                isOpen: true,
                titleDataAt: 'cbr_modal_title',
                mediaId: CASH_BACK_REWARDS_MODAL_CONTENT,
                title: getEligibilityText('cbrTitle'),
                modalBodyDataAt: 'cbr_modal_info',
                dismissButtonText: getEligibilityText('gotIt'),
                dismissButtonDataAt: 'cbr_modal_got_it_btn',
                modalDataAt: 'cbr_modal',
                modalCloseDataAt: 'cbr_modal_close_btn'
            })
        );
    }
};

const pfdOnInfoClick = (event, cmsConfig) => {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    const { isContentfulBasketEnabled } = Sephora.configurationSettings;

    if (isContentfulBasketEnabled && !Location.isCheckout()) {
        store.dispatch(
            Actions.showContentModal({
                isOpen: true,
                data: cmsConfig
            })
        );
    } else {
        const showDialogModal = Actions.showMediaModal({
            isOpen: true,
            titleDataAt: 'pfd_modal_title',
            mediaId: POINTS_FOR_DISCOUNT_MODAL,
            title: getTextForPointsForDiscount('pointsForDiscountEventTitle'),
            modalBodyDataAt: 'pfd_modal_info',
            dismissButtonText: getTextForPointsForDiscount('gotIt'),
            dismissButtonDataAt: 'pfd_modal_got_it_btn',
            modalDataAt: 'pfd_modal',
            modalCloseDataAt: 'pfd_modal_close_btn'
        });
        store.dispatch(showDialogModal);
    }
};

const withCommonPointsView = WrappedComponent => {
    const CommonPointsView = props => (
        <WrappedComponent
            {...props}
            createEligibilityInfoElement={() => {
                const { cbr, pfd } = props;
                const eligibilityInfo = getEligibility(cbr, pfd);

                return (
                    <Markdown
                        content={eligibilityInfo}
                        is='span'
                        display='inline'
                        onPostParse={html => html.substring(3, html.length - 5)}
                    />
                );
            }}
            cbrOnInfoClick={cbrOnInfoClick}
            pfdOnInfoClick={pfdOnInfoClick}
            applyToBasket={({ couponCode, promotionType }) => applyPromo(couponCode.toLowerCase(), null, CTA_TYPES[promotionType])}
            removeFromBasket={({ couponCode, promotionType }) => removePromo(couponCode.toLowerCase(), CTA_TYPES[promotionType])}
        />
    );

    CommonPointsView.displayName = `CommonPointsView(${WrappedComponent.displayName})`;

    return CommonPointsView;
};

export default { withCommonPointsView };
