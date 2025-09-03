/* eslint-disable object-curly-newline */

import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Text } from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import withCommonPointsViewComponent from 'components/Reward/LoyaltyPromo/withCommonPointsView';
import HeadImage from 'components/Reward/LoyaltyPromo/HeadImage';
import RewardSection from 'components/Reward/RewardSection/RewardSection';
import processEvent from 'analytics/processEvent';
import PromoList from 'components/Reward/LoyaltyPromo/MultiplePointsView/PromoList';
import localeUtils from 'utils/LanguageLocale';
import HeadContent from 'components/Reward/LoyaltyPromo/MultiplePointsView/HeadContent';
import PromoUtils from 'utils/Promos';
import anaConsts from 'analytics/constants';

const { withCommonPointsView } = withCommonPointsViewComponent;

const {
    ASYNC_PAGE_LOAD,
    PAGE_DETAIL: { APPLY_POINTS },
    PAGE_TYPES: { BASKET }
} = anaConsts;
const {
    PROMO_TYPES: { CBR }
} = PromoUtils;
const getText = localeUtils.getLocaleResourceFile('components/Reward/LoyaltyPromo/locales', 'LoyaltyPromo');

class MultiplePointsView extends BaseClass {
    state = {
        isExpanded: false
    };

    showModal = () => {
        this.props.showApplyRewardsModal(true, CBR, this.props.isBopis, this.props.cmsInfoModals);

        const eventArgs = {
            data: {
                pageName: `${BASKET}:${APPLY_POINTS}:n/a:*`,
                pageType: BASKET,
                pageDetail: APPLY_POINTS
            }
        };
        processEvent.process(ASYNC_PAGE_LOAD, eventArgs);
    };

    expandRewardSection = isOpen => {
        const onExpand = this.props.onExpand;

        if (isOpen) {
            this.props.expandPointsSection();

            if (onExpand) {
                onExpand();
            }
        }

        this.setState({ isExpanded: isOpen });
    };

    render() {
        const {
            forceCollapse,
            isModal,
            isHeaderOnly,
            cbr: { basketSubTotal, basketRawSubTotal },
            pfdOnInfoClick,
            cbrOnInfoClick,
            cmsInfoModals,
            netBeautyBankPointsAvailable
        } = this.props;
        const { isExpanded } = this.state;
        const isDiscountedTotal = basketRawSubTotal && basketRawSubTotal !== basketSubTotal;
        const onHeadClick = isHeaderOnly ? this.showModal : this.expandRewardSection;
        const isSomeCBRPromoApplied = this.props.cbr?.promotions?.some(option => option.isApplied);
        const isSomePFDPromoApplied = this.pfd?.promotions?.some(option => option.isApplied);

        const { onExpand, ...restProps } = this.props;

        return (
            <RewardSection
                {...restProps}
                getText={getText}
                isExpanded={!forceCollapse && isExpanded}
                headContent={
                    <HeadContent
                        getText={getText}
                        netBeautyBankPointsAvailable={netBeautyBankPointsAvailable}
                        {...restProps}
                    />
                }
                headImage={<HeadImage isModal={isModal} />}
                onHeadClick={!isModal && onHeadClick}
                data-at={Sephora.debug.dataAt('cash_reward_section')}
            >
                {isHeaderOnly || (
                    <PromoList
                        {...restProps}
                        getText={getText}
                        cbrOnInfoClick={e => cbrOnInfoClick(e, cmsInfoModals?.cbrConfig)}
                        pfdOnInfoClick={e => pfdOnInfoClick(e, cmsInfoModals?.pfdConfig)}
                    />
                )}

                {isModal && ( // subtotal Line
                    <LegacyGrid
                        gutter={2}
                        marginTop={6}
                        marginBottom={5}
                        alignItems='baseline'
                        fontWeight='bold'
                    >
                        <LegacyGrid.Cell
                            width='fill'
                            children={getText('orderSubtotal')}
                        />
                        {isDiscountedTotal && (
                            <LegacyGrid.Cell
                                width='fit'
                                css={{ textDecoration: 'line-through' }}
                                fontWeight='normal'
                                color='gray'
                            >
                                {basketRawSubTotal}
                            </LegacyGrid.Cell>
                        )}
                        <LegacyGrid.Cell width='fit'>{basketSubTotal || ''}</LegacyGrid.Cell>
                    </LegacyGrid>
                )}

                {(isSomeCBRPromoApplied || isSomePFDPromoApplied) && (
                    <Text
                        is='p'
                        color='gray'
                        fontSize='sm'
                        data-at={Sephora.debug.dataAt('points_nonrefundable_label')}
                        children={getText(isSomePFDPromoApplied ? 'pointsNonrefundable' : 'singleCbrPointsNonRefundable')}
                    />
                )}
            </RewardSection>
        );
    }
}

MultiplePointsView.defaultProps = {
    forceCollapse: false,
    isHeaderOnly: false,
    isCollapsible: false,
    isCarousel: false,
    isCheckout: false,
    isModal: false,
    onExpand: null,
    errorMessage: null,
    errorPromoCode: null
};
MultiplePointsView.propTypes = {
    forceCollapse: PropTypes.bool,
    isCarousel: PropTypes.bool,
    isCheckout: PropTypes.bool,
    isCollapsible: PropTypes.bool,
    isHeaderOnly: PropTypes.bool,
    isModal: PropTypes.bool,
    onExpand: PropTypes.func,
    availableBiPoints: PropTypes.number,
    createEligibilityInfoElement: PropTypes.func.isRequired,
    cbrOnInfoClick: PropTypes.func.isRequired,
    pfdOnInfoClick: PropTypes.func.isRequired,
    applyToBasket: PropTypes.func.isRequired,
    removeFromBasket: PropTypes.func.isRequired,
    cbr: PropTypes.shape({
        promotions: PropTypes.arrayOf(
            PropTypes.shape({
                points: PropTypes.number.isRequired,
                isApplied: PropTypes.bool.isRequired,
                couponCode: PropTypes.string.isRequired
            })
        ).isRequired,
        appliedRewardsTotal: PropTypes.number.isRequired,
        availableRewardsTotal: PropTypes.number.isRequired,
        basketSubTotal: PropTypes.string.isRequired,
        basketRawSubTotal: PropTypes.string.isRequired
    }).isRequired,
    pfd: PropTypes.shape({
        promotions: PropTypes.arrayOf(
            PropTypes.shape({
                points: PropTypes.number.isRequired,
                isApplied: PropTypes.bool.isRequired,
                couponCode: PropTypes.string.isRequired
            })
        ).isRequired,
        availableRewardsTotal: PropTypes.number
    }).isRequired,
    errorMessage: PropTypes.string,
    errorPromoCode: PropTypes.string,
    showApplyRewardsModal: PropTypes.func.isRequired,
    netBeautyBankPointsAvailable: PropTypes.number
};

export default withCommonPointsView(wrapComponent(MultiplePointsView, 'MultiplePointsView'));
