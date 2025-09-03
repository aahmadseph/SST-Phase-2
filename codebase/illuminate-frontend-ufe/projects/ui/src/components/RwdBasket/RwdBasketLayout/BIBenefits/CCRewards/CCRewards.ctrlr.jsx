/* eslint-disable class-methods-use-this */

import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import Chevron from 'components/Chevron';
import {
    Text, Box, Image, Flex, Button, Icon, Link
} from 'components/ui';
import {
    fontSizes, buttons, space, colors
} from 'style/config';
import rewardsBindings from 'analytics/bindingMethods/components/rewards/RewardsBindings';
import MultipleCCRewardsModal from 'components/RwdBasket/RwdBasketLayout/BIBenefits/CCRewards/MultipleCCRewardsModal';
import localeUtils from 'utils/LanguageLocale';
import dateUtils from 'utils/Date';
import isFunction from 'utils/functions/isFunction';
import promoUtils from 'utils/Promos';

const getText = localeUtils.getLocaleResourceFile('components/RwdBasket/RwdBasketLayout/BIBenefits/CCRewards/locales', 'CCRewards');

class CCRewards extends BaseClass {
    constructor(props) {
        super(props);
        this.state = { showMultipleCCRewardsModal: false };
    }

    applyCCRewards = () => {
        const { rewardCertificates, firstTimeCCDiscount } = this.props.ccRewardsData;
        const currentCCReward = rewardCertificates[0] || firstTimeCCDiscount;
        rewardsBindings.applyCreditCardRewards({ promoId: currentCCReward.certificateNumber });
        promoUtils.applyPromo(currentCCReward.certificateNumber.toLowerCase(), null, promoUtils.CTA_TYPES.CCR);
    };

    renderApply = () => {
        const { rewardCertificates, firstTimeCCDiscount } = this.props.ccRewardsData;
        const currentCCReward = rewardCertificates[0] || firstTimeCCDiscount;

        return currentCCReward.isApplied ? (
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
                        promoUtils.removePromo(currentCCReward.certificateNumber.toLowerCase(), promoUtils.CTA_TYPES.CCR);
                    }}
                    children={getText('remove')}
                />
            </span>
        ) : (
            <Button
                variant='secondary'
                minHeight={buttons.HEIGHT_SM}
                css={{ fontSize: fontSizes.sm }}
                data-at={Sephora.debug.dataAt('apply_btn')}
                onClick={this.applyCCRewards}
            >
                {getText('apply')}
            </Button>
        );
    };

    openMultipleCCRewardsModal = () => this.setState({ showMultipleCCRewardsModal: true });

    closeMultipleCCRewardsModal = () => this.setState({ showMultipleCCRewardsModal: false });

    renderExpiryDate = expireDate => {
        return (
            <>
                {' • '}
                <Text
                    dangerouslySetInnerHTML={{
                        __html: getText('expiry', [dateUtils.getDateInMMDDYYFormat(expireDate)])
                    }}
                />
            </>
        );
    };

    renderAvailableAndAppliedText = () => {
        const {
            availableRewardsTotal, appliedCCRewardsTotal, firstTimeCCDiscount, rewardCertificates, isMultipleCCRewards
        } =
            this.props.ccRewardsData;
        const currentCCreward = rewardCertificates[0];
        const { frictionlessCheckout } = Sephora.configurationSettings || {};

        return (
            <Text is='p'>
                {firstTimeCCDiscount && (
                    <Text>
                        <strong>{`${firstTimeCCDiscount.shortDisplayName} `}</strong>
                        {getText(firstTimeCCDiscount.isApplied ? 'firstPurchaseApplied' : 'firstPurchaseAvailable')}
                    </Text>
                )}
                {firstTimeCCDiscount && (availableRewardsTotal > 0 || appliedCCRewardsTotal > 0) && <strong>{' • '}</strong>}
                {appliedCCRewardsTotal > 0 && (
                    <Text fontSize={frictionlessCheckout?.global?.isEnabled ? 'sm' : 'base'}>
                        <strong>{`$${appliedCCRewardsTotal} ${frictionlessCheckout?.global?.isEnabled ? getText('off') : ''} `}</strong>
                        {`${getText('applied').toLowerCase()}`}
                        {frictionlessCheckout?.global?.isEnabled && !isMultipleCCRewards && this.renderExpiryDate(currentCCreward.expireDate)}
                    </Text>
                )}
                {appliedCCRewardsTotal === 0 && availableRewardsTotal > 0 && (
                    <Text>
                        <strong>{`$${availableRewardsTotal} `}</strong>
                        <strong>{`${frictionlessCheckout?.global?.isEnabled ? getText('off') : ''} `}</strong>
                        {`${getText('available')}`}
                        {!isMultipleCCRewards && frictionlessCheckout?.global?.isEnabled && this.renderExpiryDate(currentCCreward.expireDate)}
                    </Text>
                )}
            </Text>
        );
    };

    render() {
        const { ccRewardsData, infoModalCallback, orderSubTotal, grossSubTotal } = this.props;
        const {
            availableRewardsTotal,
            appliedCCRewardsTotal,
            appliedRewardsCount,
            isMultipleCCRewards,
            rewardCertificates,
            ccRemainingBalanceMessage,
            hasRemainingBalanceWarning,
            promo,
            firstTimeCCDiscount
        } = ccRewardsData;

        const error = promoUtils.extractError(promo, [promoUtils.CTA_TYPES.CCR]);
        const errorMessage = error?.errorMessages?.length ? error.errorMessages.join(' ') : null;
        const currentCCReward = rewardCertificates[0] || firstTimeCCDiscount;
        const { frictionlessCheckout } = Sephora?.configurationSettings || {};

        return (
            <>
                {this.state.showMultipleCCRewardsModal && (
                    <MultipleCCRewardsModal
                        isOpen={this.state.showMultipleCCRewardsModal}
                        rewardCertificates={rewardCertificates}
                        closeMultipleCCRewardsModal={this.closeMultipleCCRewardsModal}
                        availableRewardsTotal={availableRewardsTotal}
                        appliedRewardsTotal={appliedCCRewardsTotal}
                        orderSubTotal={orderSubTotal}
                        grossSubTotal={grossSubTotal}
                        appliedRewardsCount={appliedRewardsCount}
                        ccRemainingBalanceMessage={ccRemainingBalanceMessage}
                        error={error}
                        infoModalCallback={infoModalCallback}
                        firstTimeCCDiscount={firstTimeCCDiscount}
                        hasRemainingBalanceWarning={hasRemainingBalanceWarning}
                    />
                )}
                <Flex
                    alignItems='center'
                    justifyContent='space-between'
                    width='100%'
                    padding={3}
                    fontSize={'sm'}
                    {...(isMultipleCCRewards && {
                        onClick: () => {
                            this.openMultipleCCRewardsModal();
                        }
                    })}
                >
                    <Image
                        disableLazyLoad={true}
                        height={32}
                        width={32}
                        src='/img/ufe/credit-card/credit-card.svg'
                    />
                    <Flex
                        width='100%'
                        justifyContent='space-between'
                        alignItems='center'
                    >
                        <Box
                            marginRight={'auto'}
                            marginLeft={3}
                        >
                            <Text
                                is={'p'}
                                fontWeight='bold'
                                fontSize={fontSizes.base}
                            >
                                {getText('applyCCRewards')}
                            </Text>
                            {this.renderAvailableAndAppliedText()}
                        </Box>
                        {isMultipleCCRewards ? (
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
                {!isMultipleCCRewards && currentCCReward.isApplied && (
                    <Text
                        is='p'
                        fontSize='sm'
                        marginBottom={2}
                        paddingX={3}
                        color={colors.gray}
                    >
                        {getText(frictionlessCheckout?.global?.isEnabled ? 'ccMessageWithoutStar' : 'ccMessage')}
                        {isFunction(infoModalCallback) && (
                            <>
                                <Link
                                    color='blue'
                                    children={`${getText('clickHere')}.`}
                                    underline={true}
                                    onClick={isFunction(infoModalCallback) ? infoModalCallback : undefined}
                                />
                            </>
                        )}
                    </Text>
                )}
                {ccRemainingBalanceMessage && !isMultipleCCRewards && (
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
                            {ccRemainingBalanceMessage}
                        </Text>
                    </Flex>
                )}
                {errorMessage && !isMultipleCCRewards && (
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
            </>
        );
    }
}

export default wrapComponent(CCRewards, 'CCRewards', true);
