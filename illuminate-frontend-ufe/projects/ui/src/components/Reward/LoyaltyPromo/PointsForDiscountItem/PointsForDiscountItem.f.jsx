import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import PropTypes from 'prop-types';
import { Flex, Text } from 'components/ui';
import localeUtils from 'utils/LanguageLocale';
import PromoCta from 'components/Reward/LoyaltyPromo/PromoCta';
import Markdown from 'components/Markdown/Markdown';
import HelperUtils from 'utils/Helpers';

const { replaceDoubleAsterisks } = HelperUtils;

const getText = localeUtils.getLocaleResourceFile('components/Reward/LoyaltyPromo/locales', 'LoyaltyPromo');

const PointsForDiscountItem = ({ option, isModal, applyToBasket, removeFromBasket }) =>
    option.localizedDiscountPercentage ? (
        <Flex
            alignItems='center'
            justifyContent='space-between'
            data-at={Sephora.debug.dataAt('discount_percentage')}
        >
            <div>
                <Markdown content={replaceDoubleAsterisks(option.localizedDiscountPercentage)} />
                {option.points && (
                    <Text
                        fontSize={isModal || 'sm'}
                        data-at={Sephora.debug.dataAt('point_value')}
                    >
                        {option.points} {getText('points')}
                    </Text>
                )}
            </div>
            <PromoCta
                option={option}
                onApply={applyToBasket}
                onRemove={removeFromBasket}
                applyConfig={Sephora.isMobile() && { minWidth: '7.5em' }}
                removeConfig={{ textAlign: 'right' }}
            />
        </Flex>
    ) : null;

PointsForDiscountItem.propTypes = {
    option: PropTypes.shape({
        points: PropTypes.number.isRequired,
        isApplied: PropTypes.bool.isRequired,
        couponCode: PropTypes.string.isRequired
    }),
    appliedPercentageOff: PropTypes.number,
    createEligibilityInfoElement: PropTypes.func.isRequired
};

export default wrapFunctionalComponent(PointsForDiscountItem, 'PointsForDiscountItem');
