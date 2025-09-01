import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box, Flex, Text } from 'components/ui';
import localeUtils from 'utils/LanguageLocale';
import PromoCta from 'components/Reward/LoyaltyPromo/PromoCta';
import RougeExclusiveBadge from 'components/Badges/RougeExclusiveBadge';
import rougeExclusiveUtils from 'utils/rougeExclusive';

const getText = localeUtils.getLocaleResourceFile('components/Reward/LoyaltyPromo/locales', 'LoyaltyPromo');

const CashBackRewardItem = function ({
    isCarousel, option, isModal, applyToBasket, removeFromBasket, isDisabled
}) {
    const isMobile = Sephora.isMobile();
    const isCBRRougeExclusive = option.isSegmentsExclusive && option?.segments.includes('ROUGE');

    return isCarousel ? (
        <Box
            textAlign='center'
            data-at={Sephora.debug.dataAt('cash_reward')}
        >
            <Text
                is='p'
                marginBottom={3}
            >
                <span data-at={Sephora.debug.dataAt('discount_value')}>
                    <b>{option.localizedDiscountAmount}</b> {option.displayName}
                </span>
                <br />
                {option.points && (
                    <Flex
                        alignItems={'flex-start'}
                        gap={1}
                    >
                        <Text
                            fontSize='sm'
                            data-at={Sephora.debug.dataAt('point_value')}
                        >
                            {option.points} {getText('points')}
                        </Text>
                        {rougeExclusiveUtils.isRougeCashFlagEnabled && isCBRRougeExclusive && <RougeExclusiveBadge />}
                    </Flex>
                )}
            </Text>
            <PromoCta
                option={option}
                onApply={applyToBasket}
                onRemove={removeFromBasket}
                applyConfig={
                    (isMobile || isCarousel) && {
                        minWidth: '7.5em'
                    }
                }
                removeConfig={
                    isCarousel || {
                        textAlign: 'right'
                    }
                }
                isDisabled={isDisabled}
            />
        </Box>
    ) : (
        <Flex
            alignItems='center'
            justifyContent='space-between'
            data-at={Sephora.debug.dataAt('cash_reward')}
        >
            <div>
                <span data-at={Sephora.debug.dataAt('discount_value')}>
                    <b>{option.localizedDiscountAmount}</b> {option.displayName}
                </span>
                <br />
                {option.points && (
                    <Flex
                        alignItems={'flex-start'}
                        gap={1}
                    >
                        <Text
                            fontSize={isModal || 'sm'}
                            data-at={Sephora.debug.dataAt('point_value')}
                        >
                            {option.points} {getText('points')}
                        </Text>
                        {rougeExclusiveUtils.isRougeCashFlagEnabled && isCBRRougeExclusive && <RougeExclusiveBadge />}
                    </Flex>
                )}
            </div>
            <PromoCta
                option={option}
                onApply={applyToBasket}
                onRemove={removeFromBasket}
                applyConfig={
                    (isMobile || isCarousel) && {
                        minWidth: '7.5em'
                    }
                }
                removeConfig={
                    isCarousel || {
                        textAlign: 'right'
                    }
                }
                isDisabled={isDisabled}
            />
        </Flex>
    );
};

CashBackRewardItem.propTypes = {
    option: PropTypes.shape({
        points: PropTypes.number.isRequired,
        isApplied: PropTypes.bool.isRequired,
        couponCode: PropTypes.string.isRequired
    }),
    appliedPercentageOff: PropTypes.number
};

export default wrapFunctionalComponent(CashBackRewardItem, 'CashBackRewardItem');
