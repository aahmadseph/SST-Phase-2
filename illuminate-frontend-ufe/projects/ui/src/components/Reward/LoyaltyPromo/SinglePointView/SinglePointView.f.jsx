/* eslint-disable object-curly-newline */
import React from 'react';
import PropTypes from 'prop-types';
import { Text, Flex, Box } from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import InfoButton from 'components/InfoButton/InfoButton';
import withCommonPointsViewComponent from 'components/Reward/LoyaltyPromo/withCommonPointsView';
import ErrorMessage from 'components/Reward/LoyaltyPromo/ErrorMessage';
import HeadTitle from 'components/Reward/LoyaltyPromo/HeadTitle';
import HeadImage from 'components/Reward/LoyaltyPromo/HeadImage';
import PromoCta from 'components/Reward/LoyaltyPromo/PromoCta';
import localeUtils from 'utils/LanguageLocale';
import { wrapFunctionalComponent } from 'utils/framework';
import PromoUtils from 'utils/Promos';
import { globalModals, renderModal } from 'utils/globalModals';

const { BEAUTY_INSIDER_CASH_INFO } = globalModals;
const { withCommonPointsView } = withCommonPointsViewComponent;
const { PROMO_TYPES } = PromoUtils;
const getText = localeUtils.getLocaleResourceFile('components/Reward/LoyaltyPromo/locales', 'LoyaltyPromo');

/* eslint-disable-next-line complexity */
const SinglePointView = props => {
    const {
        isCarousel,
        isModal,
        isCheckout,
        isBopis,
        createEligibilityInfoElement,
        applyToBasket,
        removeFromBasket,
        cbr,
        pfd,
        errorMessage,
        errorPromoCode,
        availableBiPoints,
        pfdOnInfoClick,
        cbrOnInfoClick,
        cmsInfoModals,
        globalModals: globalModalsData
    } = props;
    const isMobile = Sephora.isMobile();
    const hasBorder = isCheckout || !isMobile;
    const option = cbr.promotions.length > 0 ? cbr.promotions[0] : pfd.promotions[0];
    const isPFD = option.promotionType === PROMO_TYPES.PFD;
    const errorMessageProps = {
        couponCode: option.couponCode,
        isModal,
        isCarousel,
        errorMessage,
        errorPromoCode
    };

    const cashBackRewardsIconClick = e => {
        renderModal(globalModalsData[BEAUTY_INSIDER_CASH_INFO], cbrOnInfoClick(e, cmsInfoModals?.cbrConfig));
    };

    return (
        <Flex
            flexDirection='column'
            flex={1}
            lineHeight='tight'
            {...(hasBorder && {
                position: 'relative',
                borderWidth: [null, null, 1],
                borderColor: 'midGray',
                borderRadius: 2
            })}
        >
            <HeadTitle
                isBopis={isBopis}
                isCheckout={isCheckout}
                getText={getText}
                availableBiPoints={availableBiPoints}
            />
            <Box
                paddingX={isCarousel ? 5 : hasBorder ? 4 : null}
                paddingY={isCarousel ? 5 : 3}
                data-at={Sephora.debug.dataAt('apply_points_section')}
            >
                <LegacyGrid alignItems='center'>
                    <LegacyGrid.Cell
                        paddingRight={isMobile || isCarousel ? 4 : 2}
                        width={'fit'}
                    >
                        <HeadImage
                            isModal={isModal}
                            src='/img/ufe/icons/points-cash.svg'
                        />
                    </LegacyGrid.Cell>
                    <LegacyGrid.Cell
                        is='h2'
                        fontSize={isCarousel || 'sm'}
                        width={'fill'}
                    >
                        <Text
                            fontSize='base'
                            fontWeight='bold'
                        >
                            {getText('applyPoints')}
                            {isCarousel && ': '}
                        </Text>
                        <Text
                            fontSize={isMobile || isCarousel ? 'base' : 'sm'}
                            is='div'
                        >
                            {createEligibilityInfoElement()}
                            {isPFD ? (
                                <InfoButton
                                    marginLeft={-1}
                                    onClick={e => pfdOnInfoClick(e, cmsInfoModals?.pfdConfig)}
                                    data-at={Sephora.debug.dataAt('pfd_info_icon')}
                                />
                            ) : (
                                <InfoButton
                                    marginLeft={-1}
                                    onClick={cashBackRewardsIconClick}
                                    data-at={Sephora.debug.dataAt('cbr_info_icon')}
                                />
                            )}
                        </Text>
                    </LegacyGrid.Cell>
                    <LegacyGrid.Cell width={'fit'}>
                        <PromoCta
                            option={option}
                            onApply={() => applyToBasket(option)}
                            onRemove={() => removeFromBasket(option)}
                            applyConfig={(isMobile || isCarousel) && { minWidth: '7.5em' }}
                            removeConfig={{ textAlign: 'right' }}
                        />
                    </LegacyGrid.Cell>
                </LegacyGrid>
                {isPFD && pfd.promoMessage?.length > 0 && (
                    <Box
                        borderRadius={2}
                        paddingX={2}
                        paddingY={2}
                        backgroundColor='nearWhite'
                        lineHeight='tight'
                    >
                        <Text
                            fontSize='sm'
                            children={pfd.promoMessage}
                        />
                    </Box>
                )}
                {!isPFD && cbr.promoMessage?.length > 0 && (
                    <Box
                        borderRadius={2}
                        paddingX={2}
                        paddingY={2}
                        backgroundColor='nearWhite'
                        lineHeight='tight'
                    >
                        <Text
                            fontSize='sm'
                            children={cbr.promoMessage}
                        />
                    </Box>
                )}
                {option.isApplied && (
                    <Text
                        is='p'
                        color='gray'
                        marginTop={4}
                        fontSize='sm'
                        data-at={Sephora.debug.dataAt('points_nonrefundable_label')}
                        children={getText('singleCbrPointsNonRefundable')}
                    />
                )}
                <ErrorMessage {...errorMessageProps} />
            </Box>
        </Flex>
    );
};

SinglePointView.defaultProps = {
    isCarousel: false,
    isCheckout: false,
    isModal: false,
    errorMessage: null,
    errorPromoCode: null
};
SinglePointView.propTypes = {
    isCarousel: PropTypes.bool,
    isCheckout: PropTypes.bool,
    isModal: PropTypes.bool,
    availableBiPoints: PropTypes.number.isRequired,
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
        availableRewardsTotal: PropTypes.number.isRequired
    }).isRequired,
    pfd: PropTypes.shape({
        promotions: PropTypes.arrayOf(
            PropTypes.shape({
                points: PropTypes.number.isRequired,
                isApplied: PropTypes.bool.isRequired,
                couponCode: PropTypes.string.isRequired
            })
        ).isRequired,
        availableRewardsTotal: PropTypes.number.isRequired
    }).isRequired,
    errorMessage: PropTypes.string,
    errorPromoCode: PropTypes.string
};

export default withCommonPointsView(wrapFunctionalComponent(SinglePointView, 'SinglePointView'));
