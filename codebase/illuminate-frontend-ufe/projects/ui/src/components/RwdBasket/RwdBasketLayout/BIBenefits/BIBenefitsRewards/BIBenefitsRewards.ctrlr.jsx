/* eslint-disable complexity */
/* eslint-disable class-methods-use-this */

import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    Text, Box, Image, Flex, Button, Link, Icon
} from 'components/ui';
import {
    fontSizes, space, colors, buttons
} from 'style/config';
import Chevron from 'components/Chevron';
import InfoButton from 'components/InfoButton';
import localeUtils from 'utils/LanguageLocale';
import promoUtils from 'utils/Promos';
import helpersUtils from 'utils/Helpers';
import isFunction from 'utils/functions/isFunction';
import RwdBasketActions from 'actions/RwdBasketActions/RwdBasketActions';
import RougeExclusiveBadge from 'components/Badges/RougeExclusiveBadge';
import rougeExclusiveUtils from 'utils/rougeExclusive';

const { openMultipleRougeRewardsModal } = RwdBasketActions;
const { formatPrice } = helpersUtils;
const { getLocaleResourceFile, isFrench, getCurrentCountry, isCanada } = localeUtils;
const getText = getLocaleResourceFile('components/RwdBasket/RwdBasketLayout/BIBenefits/BIBenefitsRewards/locales', 'BIBenefitsRewards');

class BIBenefitsRewards extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            differentCountryCouponCode: null
        };
    }

    handleApplyPromo = e => {
        const { mainRougeReward } = this.props;
        const differentCountry = getCurrentCountry().toUpperCase() !== mainRougeReward.country.toUpperCase();

        if (differentCountry) {
            this.setState({ differentCountryCouponCode: mainRougeReward.couponCode.toLowerCase() });
        } else {
            this.setState({ differentCountryCouponCode: null });
            e.preventDefault();
            promoUtils.applyPromo(mainRougeReward.couponCode.toLowerCase(), null, promoUtils.CTA_TYPES.RRC);
        }
    };

    renderApply() {
        const { disableRougeRewards, mainRougeReward } = this.props;

        return mainRougeReward.isApplied && !disableRougeRewards ? (
            <span>
                <Icon
                    name='checkmark'
                    size='1em'
                    css={{
                        position: 'absolute',
                        transform: `translateX(calc(-100% - ${space[1]}px))`
                    }}
                />
                <Text fontWeight='bold'>{getText('applied')}</Text>
                <Link
                    is='p'
                    fontSize='xs'
                    fontWeight='normal'
                    display='block'
                    color='blue'
                    onClick={e => {
                        e.preventDefault();
                        promoUtils.removePromo(mainRougeReward.couponCode.toLowerCase());
                    }}
                    children={getText('remove')}
                />
            </span>
        ) : (
            <Button
                variant='secondary'
                minHeight={buttons.HEIGHT_SM}
                css={{ fontSize: fontSizes.sm }}
                disabled={disableRougeRewards}
                data-at={Sephora.debug.dataAt('apply_btn')}
                onClick={this.handleApplyPromo}
            >
                {getText('apply')}
            </Button>
        );
    }

    render() {
        const {
            disableRougeRewards,
            onBasketSwitch,
            mainRougeReward,
            showChevron,
            availableRougeRewards,
            rougeInfoModalCallback,
            promo,
            rrcRemainingBalanceMessage,
            rougeDisabledMessage,
            rougeDisabledRedirectMessage
        } = this.props;

        const { differentCountryCouponCode } = this.state;
        const error = promoUtils.extractError(promo, [promoUtils.CTA_TYPES.RRC]);
        const errorMessage = error?.errorMessages?.length ? error.errorMessages.join(' ') : null;
        const differentCountryMessage = isCanada() ? getText('switchToUS') : getText('switchToCA');
        const { frictionlessCheckout } = Sephora?.configurationSettings || {};

        return (
            <>
                <Flex
                    alignItems='center'
                    padding={3}
                    fontSize={'sm'}
                    width='100%'
                    onClick={e => {
                        if (!showChevron) {
                            return;
                        }

                        e.stopPropagation();
                        openMultipleRougeRewardsModal(true, availableRougeRewards, frictionlessCheckout?.global?.isEnabled);
                    }}
                >
                    <Image
                        disableLazyLoad={true}
                        height={32}
                        width={32}
                        src='/img/ufe/rwd-basket/rouge_rewards.svg'
                    />
                    <Flex
                        width='100%'
                        justifyContent='space-between'
                        alignItems='center'
                    >
                        <Box marginLeft={3}>
                            <Text
                                is={'p'}
                                width={isFrench() ? '90%' : '100%'}
                                fontWeight='bold'
                                fontSize={fontSizes.base}
                            >
                                {frictionlessCheckout?.global?.isEnabled ? getText('checkoutTitle') : getText('title')}
                                <InfoButton
                                    isOutline
                                    marginLeft={-1}
                                    onClick={e => {
                                        e.stopPropagation();

                                        if (isFunction(rougeInfoModalCallback)) {
                                            rougeInfoModalCallback();
                                        }
                                    }}
                                />
                            </Text>
                            <Text
                                is='p'
                                marginTop={1}
                                dangerouslySetInnerHTML={{
                                    __html: mainRougeReward.isApplied
                                        ? getText('rougeRewardsAppliedMessage', [formatPrice(`$${mainRougeReward.denomination}`)])
                                        : showChevron
                                            ? getText('newRougeRewardsMessage', [
                                                formatPrice(`$${mainRougeReward.denomination}`),
                                                mainRougeReward.expirationDate
                                            ])
                                            : getText('rougeRewardsMessage', [
                                                formatPrice(`$${mainRougeReward.denomination}`),
                                                mainRougeReward.expirationDate
                                            ])
                                }}
                            />
                            {rougeExclusiveUtils.isRougeExclusiveForBasket() && <RougeExclusiveBadge />}
                        </Box>
                        {showChevron ? (
                            <Chevron
                                size={fontSizes.base}
                                direction='right'
                                color={'#888'}
                            />
                        ) : (
                            this.renderApply()
                        )}
                    </Flex>
                </Flex>
                {rrcRemainingBalanceMessage && !showChevron && (
                    <Flex
                        lineHeight='tight'
                        backgroundColor='nearWhite'
                        marginBottom={3}
                        paddingX={3}
                        marginX={3}
                        paddingY={2}
                        borderRadius={2}
                    >
                        <Text
                            is='p'
                            alignSelf='center'
                            fontSize='sm'
                            data-at={Sephora.debug.dataAt('warning_label')}
                        >
                            {differentCountryCouponCode
                                ? differentCountryMessage
                                : rrcRemainingBalanceMessage
                                    ? rrcRemainingBalanceMessage
                                    : errorMessage}{' '}
                        </Text>
                    </Flex>
                )}
                {errorMessage && !showChevron && (
                    <Text
                        is='p'
                        alignSelf='center'
                        fontSize='sm'
                        color={colors.gray}
                        marginX={3}
                        marginBottom={[2, 3]}
                        marginTop={[-1, -2]}
                        data-at={Sephora.debug.dataAt('warning_label')}
                    >
                        {errorMessage}
                    </Text>
                )}
                {disableRougeRewards && (
                    <Text
                        is='p'
                        fontSize='sm'
                        paddingLeft={3}
                        marginBottom={2}
                        color={colors.gray}
                    >
                        {rougeDisabledMessage}
                        {rougeDisabledRedirectMessage ? (
                            <Link
                                color='blue'
                                onClick={e => {
                                    e.stopPropagation();
                                    onBasketSwitch();
                                }}
                                children={`${rougeDisabledRedirectMessage}.`}
                            />
                        ) : null}
                    </Text>
                )}
            </>
        );
    }
}

export default wrapComponent(BIBenefitsRewards, 'BIBenefitsRewards', true);
