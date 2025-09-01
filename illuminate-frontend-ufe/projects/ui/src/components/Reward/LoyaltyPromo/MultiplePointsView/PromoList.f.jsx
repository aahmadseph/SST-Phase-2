import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Flex, Text, Image, Divider, Box
} from 'components/ui';
import Flag from 'components/Flag/Flag';
import PointsForDiscountItem from 'components/Reward/LoyaltyPromo/PointsForDiscountItem/PointsForDiscountItem';
import InfoButton from 'components/InfoButton/InfoButton';
import ErrorMessage from 'components/Reward/LoyaltyPromo/ErrorMessage';
import CashBackRewardItem from 'components/Reward/LoyaltyPromo/CashBackRewardItem/CashBackRewardItem';
import { globalModals, renderModal } from 'utils/globalModals';

const { BEAUTY_INSIDER_CASH_INFO } = globalModals;

const PromoList = ({
    isModal,
    isCheckout,
    isCarousel,
    applyToBasket,
    errorMessage,
    errorPromoCode,
    removeFromBasket,
    pfd,
    cbr,
    getText,
    pfdOnInfoClick,
    cbrOnInfoClick,
    globalModals: globalModalsData
}) => {
    const cbrPromotions = cbr && cbr.promotions;
    const pointsForDiscountPromotions = pfd && pfd.promotions;
    const iconSize = isModal ? 32 : 24;
    const itemSpace = isModal ? 4 : 3;
    const hasCbr = cbrPromotions.length > 0;
    const hasPfd = pointsForDiscountPromotions.length > 0;
    const promoEndDate = pfd && pfd.promoEndDate;
    const isDesktop = Sephora.isDesktop();
    const getErrorProps = couponCode => ({
        couponCode,
        isModal,
        isCarousel,
        errorMessage,
        errorPromoCode
    });
    const EndDateComp = (
        <Flag
            children={getText('ends', [promoEndDate])}
            data-at={Sephora.debug.dataAt('pfd_end_date')}
        />
    );
    const showEndDateInline = isCheckout && isDesktop;
    const isSomePromoApplied = cbrPromotions.some(promo => promo.isApplied);

    return (
        <React.Fragment>
            {hasCbr && (
                <React.Fragment>
                    <Text
                        is='p'
                        fontSize='base'
                        marginTop={isDesktop && isCheckout ? 0 : 3}
                        marginBottom={4}
                        color='gray'
                        textAlign={isCheckout || 'center'}
                        data-at={Sephora.debug.dataAt('please_choose_one')}
                        children={getText('chooseOne')}
                    />
                    <div data-at={Sephora.debug.dataAt('cbr_section')}>
                        <Flex
                            fontWeight='bold'
                            alignItems='center'
                        >
                            <Image
                                src='/img/ufe/icons/points-cash.svg'
                                width={iconSize}
                                height={iconSize}
                                data-at={Sephora.debug.dataAt('cbr_image_icon')}
                            />
                            <Text
                                marginX={2}
                                fontSize='base'
                                children={getText('BeautyInsiderCashTitle')}
                                data-at={Sephora.debug.dataAt('cbr_label')}
                            />
                            <InfoButton
                                onClick={() => renderModal(globalModalsData[BEAUTY_INSIDER_CASH_INFO], cbrOnInfoClick)}
                                data-at={Sephora.debug.dataAt('cbr_info_icon')}
                            />
                        </Flex>
                        <Divider
                            marginTop={2}
                            marginBottom={itemSpace}
                        />
                        {cbrPromotions.map(option => {
                            return (
                                <React.Fragment key={`${option.couponCode}`}>
                                    <CashBackRewardItem
                                        applyToBasket={() => applyToBasket(option)}
                                        removeFromBasket={() => removeFromBasket(option)}
                                        isModal={true}
                                        option={option}
                                        isDisabled={isSomePromoApplied && !option.isApplied}
                                    />
                                    <ErrorMessage
                                        data-at={Sephora.debug.dataAt('cbr_error_msg')}
                                        {...getErrorProps(option.couponCode)}
                                    />
                                    <Divider marginY={itemSpace} />
                                </React.Fragment>
                            );
                        })}
                        {cbr.promoMessage?.length > 0 && (
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
                    </div>
                </React.Fragment>
            )}
            {hasPfd && (
                <div data-at={Sephora.debug.dataAt('pfd_section')}>
                    <Flex
                        marginTop={hasPfd && (isModal ? 5 : 3)}
                        marginBottom={1}
                        fontWeight='bold'
                        alignItems='center'
                    >
                        <Image
                            src='/img/ufe/icons/points-discount.svg'
                            width={iconSize}
                            height={iconSize}
                            data-at={Sephora.debug.dataAt('pfd_image_icon')}
                        />
                        <Text
                            marginX={2}
                            fontSize='base'
                            children={getText('PointsForDiscountTitle')}
                            data-at={Sephora.debug.dataAt('pfd_label')}
                        />
                        {showEndDateInline && EndDateComp}
                        <InfoButton
                            marginLeft={-1}
                            onClick={pfdOnInfoClick}
                            data-at={Sephora.debug.dataAt('pfd_info_icon')}
                        />
                    </Flex>
                    {promoEndDate && !showEndDateInline && <Flex>{EndDateComp}</Flex>}
                    <Divider
                        marginTop={2}
                        marginBottom={itemSpace}
                    />
                    {pointsForDiscountPromotions.map(option => (
                        <React.Fragment key={`${option.couponCode}`}>
                            <PointsForDiscountItem
                                applyToBasket={() => applyToBasket(option)}
                                removeFromBasket={() => removeFromBasket(option)}
                                isModal={true}
                                getText={getText}
                                option={option}
                            />
                            <ErrorMessage
                                data-at={Sephora.debug.dataAt('pfd_error_msg')}
                                {...getErrorProps(option.couponCode)}
                            />
                            <Divider marginY={itemSpace} />
                        </React.Fragment>
                    ))}
                    {pfd.promoMessage?.length > 0 && (
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
                </div>
            )}
        </React.Fragment>
    );
};

PromoList.propTypes = {
    applyToBasket: PropTypes.func.isRequired,
    removeFromBasket: PropTypes.func.isRequired,
    isCarousel: PropTypes.bool,
    isCheckout: PropTypes.bool,
    isModal: PropTypes.bool,
    getText: PropTypes.func.isRequired,
    cbr: PropTypes.shape({
        promotions: PropTypes.arrayOf(
            PropTypes.shape({
                points: PropTypes.number.isRequired,
                isApplied: PropTypes.bool.isRequired,
                couponCode: PropTypes.string.isRequired
            })
        ).isRequired
    }).isRequired,
    pfd: PropTypes.shape({
        promotions: PropTypes.arrayOf(
            PropTypes.shape({
                points: PropTypes.number.isRequired,
                isApplied: PropTypes.bool.isRequired,
                couponCode: PropTypes.string.isRequired
            })
        ).isRequired
    }).isRequired,
    errorMessage: PropTypes.string,
    errorPromoCode: PropTypes.string,
    pfdOnInfoClick: PropTypes.func.isRequired,
    cbrOnInfoClick: PropTypes.func.isRequired
};

export default wrapFunctionalComponent(PromoList, 'PromoList');
