import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Box, Flex, Text, Button, Link
} from 'components/ui';
import IconCheckmark from 'components/LegacyIcon/IconCheckmark';
import localeUtils from 'utils/LanguageLocale';
import dateUtils from 'utils/Date';

const Reward = props => {
    const isApplyDisabled = function () {
        const { basketSubTotal, isMaxCCRewardsLimitReached, isDisabled } = props;

        return isDisabled || isMaxCCRewardsLimitReached || basketSubTotal === 0;
    };

    const getAriaLabel = function (getText) {
        const { option } = props;

        return getText(option.isApplied ? 'remove' : 'apply') + ` $${option.rewardAmount} ${getText('ccReward')}`;
    };

    const displayRewardOrDiscount = function (isFirstPurchaseDiscount, getText) {
        const { option } = props;

        return isFirstPurchaseDiscount ? (
            <React.Fragment>
                <b>{option.shortDisplayName}</b> {getText('firstPurchase')}
            </React.Fragment>
        ) : (
            <React.Fragment>
                <b>${option.rewardAmount}</b> {getText('ccReward')}
            </React.Fragment>
        );
    };

    const renderCarouselReward = function (getText) {
        const { option, applyToBasket, removeFromBasket, isDisabled } = props;

        const expireDate = option.expireDate
            ? option.expireDate
            : option.couponExpirationDate
                ? dateUtils.getDateInMDYFormatRewards(option.couponExpirationDate)
                : null;

        return (
            <Box
                data-at={Sephora.debug.dataAt('cc_reward_item')}
                textAlign='center'
            >
                <Text
                    is='p'
                    marginBottom={2}
                >
                    <span data-at={Sephora.debug.dataAt('cc_reward_name')}>{displayRewardOrDiscount(option.isFirstPurchaseDiscount, getText)}</span>
                    <br />
                    {expireDate && (
                        <Text
                            data-at={Sephora.debug.dataAt('expiration_date')}
                            fontSize='sm'
                            color='gray'
                        >
                            {getText('exp')} {expireDate}
                        </Text>
                    )}
                </Text>
                {option.isApplied ? (
                    <React.Fragment>
                        <Flex
                            lineHeight='none'
                            justifyContent='center'
                            fontWeight='bold'
                            alignItems='center'
                        >
                            <IconCheckmark
                                fontSize='xs'
                                marginRight={1}
                            />
                            {getText('applied')}
                        </Flex>
                        <Link
                            aria-label={getAriaLabel(getText)}
                            color='blue'
                            padding={2}
                            margin={-2}
                            onClick={() => removeFromBasket(option.certificateNumber)}
                            disabled={isDisabled}
                            children={getText('remove')}
                        />
                    </React.Fragment>
                ) : (
                    <Button
                        aria-label={getAriaLabel(getText)}
                        minWidth='7.5em'
                        onClick={() => applyToBasket(option.certificateNumber)}
                        disabled={isApplyDisabled()}
                        variant='secondary'
                        size='sm'
                        children={getText('apply')}
                    />
                )}
            </Box>
        );
    };

    const renderListReward = function (getText) {
        const isMobile = Sephora.isMobile();

        const { option, applyToBasket, removeFromBasket, isDisabled } = props;

        const expireDate = option.expireDate
            ? option.expireDate
            : option.couponExpirationDate
                ? dateUtils.getDateInMDYFormatRewards(option.couponExpirationDate)
                : null;

        return (
            <Flex
                key={option.certificateNumber}
                alignItems='center'
                data-at={Sephora.debug.dataAt('cc_reward_item')}
                justifyContent='space-between'
            >
                <div>
                    <span data-at={Sephora.debug.dataAt('cc_reward_name')}>{displayRewardOrDiscount(option.isFirstPurchaseDiscount, getText)}</span>
                    <br />
                    {expireDate && (
                        <Text
                            fontSize='sm'
                            data-at={Sephora.debug.dataAt('expiration_date')}
                            color='gray'
                        >
                            {getText('exp')} {expireDate}
                        </Text>
                    )}
                </div>
                {option.isApplied ? (
                    <Box textAlign='right'>
                        <Flex
                            fontWeight='bold'
                            alignItems='center'
                        >
                            <IconCheckmark
                                fontSize='xs'
                                marginRight={1}
                            />
                            {getText('applied')}
                        </Flex>
                        <Link
                            aria-label={getAriaLabel(getText)}
                            color='blue'
                            padding={2}
                            margin={-2}
                            onClick={() => removeFromBasket(option.certificateNumber)}
                            disabled={isDisabled}
                            children={getText('remove')}
                        />
                    </Box>
                ) : (
                    <Button
                        aria-label={getAriaLabel(getText)}
                        minWidth={isMobile && '7.5em'}
                        onClick={() => applyToBasket(option.certificateNumber)}
                        disabled={isApplyDisabled()}
                        variant='secondary'
                        size='sm'
                        children={getText('apply')}
                    />
                )}
            </Flex>
        );
    };
    const getText = localeUtils.getLocaleResourceFile('components/CreditCard/Rewards/locales', 'Reward');
    const { isCarousel } = props;

    return isCarousel ? renderCarouselReward(getText) : renderListReward(getText);
};

export default wrapFunctionalComponent(Reward, 'Reward');
