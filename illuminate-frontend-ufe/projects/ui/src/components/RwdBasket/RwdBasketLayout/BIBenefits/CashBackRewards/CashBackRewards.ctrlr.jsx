/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import {
    Text, Box, Image, Flex, Divider, Button, Icon, Link
} from 'components/ui';
import Chevron from 'components/Chevron';
import InfoButton from 'components/InfoButton';
import Modal from 'components/Modal/Modal';
import RougeExclusiveBadge from 'components/Badges/RougeExclusiveBadge';

import {
    fontSizes, fontWeights, buttons, space, colors
} from 'style/config';

import isFunction from 'utils/functions/isFunction';
import promoUtils from 'utils/Promos';
const { CTA_TYPES, applyPromo, removePromo } = promoUtils;
import localeUtils from 'utils/LanguageLocale';
import rougeExclusiveUtils from 'utils/rougeExclusive';
import processEvent from 'analytics/processEvent';
import analyticsConstants from 'analytics/constants';
import Empty from 'constants/empty';
import UIUtils from 'utils/UI';
const { isSMUI } = UIUtils;

const getText = localeUtils.getLocaleResourceFile('components/RwdBasket/RwdBasketLayout/BIBenefits/CashBackRewards/locales', 'CashBackRewards');

function InfoModalIcon({ infoModalCallback, ...props }) {
    return isFunction(infoModalCallback) ? (
        <InfoButton
            isOutline
            marginLeft={-1}
            onClick={e => {
                e.stopPropagation();

                infoModalCallback();
            }}
            {...props}
        />
    ) : null;
}

function ApplyButton({
    isApplied, onApply, onRemove, isEligible, couponCode, promotionType, isDisabled = false
}) {
    const { frictionlessCheckout } = Sephora.configurationSettings;
    const handleOnclick = e => {
        e.stopPropagation();
        onRemove({ couponCode, promotionType });
    };

    return isApplied ? (
        <span>
            <Icon
                name={'checkmark'}
                size={'1em'}
                css={{
                    position: 'absolute',
                    transform: `translateX(calc(-100% - ${space[1]}px))`
                }}
            />
            <Text {...(!frictionlessCheckout?.global?.isEnabled ? { fontWeight: 'bold' } : {})}>{getText('applied')}</Text>
            <Link
                is={'p'}
                fontSize={fontSizes.xs}
                fontWeight={fontWeights.bold}
                display={'block'}
                color={colors.blue}
                onClick={handleOnclick}
                children={getText('remove')}
            />
        </span>
    ) : (
        <Button
            variant={'secondary'}
            minHeight={buttons.HEIGHT_SM}
            css={{ fontSize: fontSizes.sm }}
            data-at={Sephora.debug.dataAt('apply_btn')}
            onClick={() => onApply({ couponCode, promotionType })}
            disabled={!isEligible || isDisabled}
        >
            {getText('apply')}
        </Button>
    );
}

function MultipleCashBackRewards({
    availableCash,
    appliedValue,
    showModal,
    isApplied,
    infoModalCallback,
    isFrictionlessCheckoutEnabled,
    promos,
    onRemove,
    userCBRPoints
}) {
    let appliedOrRedeemText;

    const eligibleRewards = promos?.filter(promo => promo.isEligible) || [];
    const bestReward = eligibleRewards?.length
        ? eligibleRewards?.reduce((bestPromo, promo) => (promo.discountAmount > bestPromo.discountAmount ? promo : bestPromo))
        : Empty.Object;
    const appliedReward = promos?.find(promo => promo.isApplied);

    if (isApplied) {
        appliedOrRedeemText = isFrictionlessCheckoutEnabled ? getText('newAmountApplied', [appliedValue]) : getText('amountApplied', [appliedValue]);
    } else {
        appliedOrRedeemText =
            isFrictionlessCheckoutEnabled && Object.keys(bestReward)?.length
                ? getText('newMultiplePromoSubTitle', [bestReward?.points, bestReward?.localizedDiscountAmount])
                : getText('multiplePromoSubTitle', [availableCash]);
    }

    return (
        <div
            onClick={showModal}
            style={{ cursor: 'pointer' }}
        >
            <Flex
                width={'100%'}
                justifyContent={'space-between'}
                alignItems={'center'}
            >
                <Flex
                    width={32}
                    height={32}
                    alignItems={'center'}
                    justifyContent={'space-around'}
                >
                    <Image
                        disableLazyLoad={true}
                        src='/img/ufe/rwd-basket/cash-back-rewards.svg'
                    />
                </Flex>
                <Box
                    marginRight={'auto'}
                    marginLeft={3}
                >
                    <Text
                        is={'p'}
                        fontWeight={fontWeights.bold}
                        fontSize={fontSizes.base}
                        {...(localeUtils.isFrench() && isSMUI() && { paddingRight: '5px' })}
                    >
                        {getText(isFrictionlessCheckoutEnabled ? 'newTitle' : 'title')}
                    </Text>
                    <Text
                        is={'p'}
                        marginTop={'2px'}
                        display={'flex'}
                    >
                        <Text
                            dangerouslySetInnerHTML={{
                                __html: appliedOrRedeemText
                            }}
                        />
                        <InfoModalIcon
                            infoModalCallback={infoModalCallback}
                            aria-label={getText('moreInfo')}
                        />
                        {!isFrictionlessCheckoutEnabled && rougeExclusiveUtils.renderRougeExclusiveBadge(userCBRPoints) && <RougeExclusiveBadge />}
                    </Text>
                    {isFrictionlessCheckoutEnabled && rougeExclusiveUtils.renderRougeExclusiveBadge(userCBRPoints) && (
                        <Box marginTop={1}>
                            <RougeExclusiveBadge />
                        </Box>
                    )}
                </Box>
                {isApplied ? (
                    <ApplyButton
                        isApplied={isApplied}
                        onRemove={onRemove}
                        couponCode={appliedReward?.couponCode}
                        promotionType={appliedReward?.promotionType}
                    />
                ) : (
                    <Chevron
                        direction={'right'}
                        size={fontSizes.base}
                        color={'#888'}
                    />
                )}
            </Flex>
            {isApplied && (
                <Box
                    color={colors.gray}
                    fontSize={fontSizes.sm}
                    marginTop={2}
                >
                    {getText('pointsAppliedLegal')}
                </Box>
            )}
        </div>
    );
}

function SingleCashBackReward({
    localizedDiscountAmount,
    points,
    couponCode,
    promotionType,
    appliedValue,
    isApplied,
    isEligible,
    infoModalCallback,
    onApply,
    onRemove,
    error,
    isFrictionlessCheckoutEnabled,
    pointsRequired,
    userCBRPoints
}) {
    let appliedOrRedeemText;

    if (isApplied) {
        appliedOrRedeemText = isFrictionlessCheckoutEnabled ? getText('newAmountApplied', [appliedValue]) : getText('amountApplied', [appliedValue]);
    } else {
        appliedOrRedeemText = isFrictionlessCheckoutEnabled
            ? getText('newSinglePromoSubTitle', [pointsRequired, localizedDiscountAmount])
            : getText('singlePromoSubTitle', [localizedDiscountAmount, points]);
    }

    return (
        <Box>
            <Flex
                width={'100%'}
                justifyContent={'space-between'}
                alignItems={'center'}
            >
                <Flex
                    width={32}
                    height={32}
                    alignItems={'center'}
                    justifyContent={'space-around'}
                >
                    <Image
                        disableLazyLoad={true}
                        src='/img/ufe/rwd-basket/cash-back-rewards.svg'
                    />
                </Flex>
                <Box
                    marginRight={'auto'}
                    marginLeft={3}
                >
                    <Text
                        is={'p'}
                        fontWeight={fontWeights.bold}
                        fontSize={fontSizes.base}
                    >
                        {getText(isFrictionlessCheckoutEnabled ? 'newTitle' : 'title')}
                    </Text>
                    <Text
                        is={'p'}
                        marginTop={'2px'}
                        display='flex'
                    >
                        <Text
                            dangerouslySetInnerHTML={{
                                __html: appliedOrRedeemText
                            }}
                        />
                        <InfoModalIcon
                            infoModalCallback={infoModalCallback}
                            aria-label={getText('moreInfo')}
                        />
                        {rougeExclusiveUtils.renderRougeExclusiveBadge(userCBRPoints) && <RougeExclusiveBadge />}
                    </Text>
                </Box>
                <ApplyButton
                    isApplied={isApplied}
                    onApply={onApply}
                    onRemove={onRemove}
                    isEligible={isEligible}
                    couponCode={couponCode}
                    promotionType={promotionType}
                />
            </Flex>
            {isApplied && (
                <Box
                    color={colors.gray}
                    fontSize={fontSizes.sm}
                    marginTop={2}
                >
                    {getText('pointsAppliedLegal')}
                </Box>
            )}
            {error.isAvailable && (
                <Box
                    color={colors.gray}
                    fontSize={fontSizes.sm}
                    marginTop={3}
                >
                    {error.message}
                </Box>
            )}
        </Box>
    );
}

function MultiplePromosModal({
    isOpen, onDismiss, onApply, onRemove, biPoints, promos, subtotal, rawSubTotal, error
}) {
    const isOneApplied = promos.some(promo => promo.isApplied === true);

    return (
        <Modal
            width={0}
            isOpen={isOpen}
            onDismiss={onDismiss}
            isDrawer={true}
            customStyle={{ height: '464px' }}
        >
            <Modal.Header>
                <Modal.Title>
                    <Box
                        fontSize={fontSizes.md}
                        marginBottom={'3px'}
                    >
                        {getText('modalTitle')}
                    </Box>
                    <Box
                        fontSize={fontSizes.base}
                        fontWeight={fontWeights.normal}
                        dangerouslySetInnerHTML={{
                            __html: getText('modalSubTitle', [biPoints])
                        }}
                    />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body
                paddingTop={0}
                paddingBottom={0}
                paddingX={4}
            >
                <Box
                    color={colors.gray}
                    paddingTop={3}
                    paddingBottom={2}
                >
                    {getText('chooseText')}
                </Box>
                {promos.map(
                    (
                        {
                            points,
                            localizedDiscountAmount,
                            couponCode,
                            promotionType,
                            isApplied,
                            isEligible,
                            isSegmentsExclusive = false,
                            segments = []
                        },
                        i
                    ) => {
                        const isCBRRougeExclusive = isSegmentsExclusive && segments.includes('ROUGE');

                        return (
                            <>
                                <Flex
                                    flexDirection={'row'}
                                    justifyContent={'space-between'}
                                    alignItems={'center'}
                                    paddingBottom={3}
                                >
                                    <Box>
                                        <Box
                                            dangerouslySetInnerHTML={{
                                                __html: getText('biCashAmount', [localizedDiscountAmount])
                                            }}
                                        />
                                        <Flex
                                            alignItems={'flex-start'}
                                            gap={1}
                                        >
                                            <Box
                                                fontSize={fontSizes.sm}
                                                dangerouslySetInnerHTML={{
                                                    __html: getText('pointsAmount', [points])
                                                }}
                                            />
                                            {rougeExclusiveUtils.isRougeCashFlagEnabled && isCBRRougeExclusive && <RougeExclusiveBadge />}
                                        </Flex>
                                    </Box>
                                    <ApplyButton
                                        isApplied={isApplied}
                                        onApply={onApply}
                                        onRemove={onRemove}
                                        isEligible={isEligible}
                                        couponCode={couponCode}
                                        isDisabled={isOneApplied && !isApplied}
                                        promotionType={promotionType}
                                    />
                                </Flex>
                                {error.isAvailable && error.couponCode === couponCode && (
                                    <Box
                                        color={colors.gray}
                                        fontSize={fontSizes.sm}
                                        marginBottom={2}
                                    >
                                        {error.message}
                                    </Box>
                                )}
                                {i !== promos.length - 1 && (
                                    <Divider
                                        marginBottom={3}
                                        marginX={-4}
                                    />
                                )}
                            </>
                        );
                    }
                )}
            </Modal.Body>
            <Box
                position={'relative'}
                borderColor={colors.lightGray}
                borderTopWidth={1}
            >
                <Flex
                    flexDirection={'row'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    paddingY={3}
                    paddingX={4}
                >
                    <Box fontWeight={fontWeights.bold}>{getText('subtotal')}</Box>
                    <Box paddingRight={3}>
                        {subtotal !== rawSubTotal && (
                            <Text
                                css={{ textDecoration: 'line-through' }}
                                paddingRight={1}
                                color={colors.gray}
                            >
                                {rawSubTotal}
                            </Text>
                        )}
                        <Text fontWeight={fontWeights.bold}>{subtotal}</Text>
                    </Box>
                </Flex>
                <Flex
                    fontSize={fontSizes.sm}
                    color={colors.gray}
                    paddingBottom={3}
                    paddingX={4}
                >
                    {getText('pointsAppliedLegal')}
                </Flex>
                <Box
                    boxShadow={'0px 0px 6px 0px rgba(0, 0, 0, 0.20)'}
                    paddingX={4}
                    paddingY={3}
                    borderRadius={'0px 0px 6px 6px'}
                >
                    <Button
                        variant='primary'
                        block={true}
                        onClick={onDismiss}
                        children={getText('done')}
                    />
                </Box>
            </Box>
        </Modal>
    );
}

// Also known as BI Cash
class CashBackRewards extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            multiplePromosModalIsOpen: false
        };
    }

    updateMultiplePromosModal = bool => {
        this.setState({ multiplePromosModalIsOpen: bool });

        if (bool) {
            const pageType = analyticsConstants.PAGE_TYPES.BASKET;
            const pageDetail = analyticsConstants.PAGE_DETAIL.APPLY_POINTS;
            const pageName = `${pageType}:${pageDetail}:n/a:*`;
            processEvent.process(analyticsConstants.PAGE_LOAD, {
                data: {
                    pageName,
                    pageType,
                    pageDetail
                }
            });
        }
    };

    applyToBasket = ({ couponCode, promotionType }) => applyPromo(couponCode.toLowerCase(), null, CTA_TYPES[promotionType]);

    removeFromBasket = ({ couponCode, promotionType }) => removePromo(couponCode.toLowerCase(), CTA_TYPES[promotionType]);

    render() {
        const {
            availableCash, promos, infoModalCallback, appliedValue, biPoints, subtotal, rawSubTotal, error
        } = this.props;
        const { frictionlessCheckout } = Sephora.configurationSettings;

        return (
            <>
                <Box
                    width='100%'
                    fontSize={fontSizes.sm}
                    padding={3}
                >
                    {promos.length === 1 ? (
                        <SingleCashBackReward
                            {...promos[0]}
                            infoModalCallback={infoModalCallback}
                            onApply={this.applyToBasket}
                            onRemove={this.removeFromBasket}
                            appliedValue={appliedValue}
                            error={error}
                            pointsRequired={promos?.[0]?.points}
                            isFrictionlessCheckoutEnabled={frictionlessCheckout?.global?.isEnabled}
                            userCBRPoints={biPoints}
                        />
                    ) : (
                        <MultipleCashBackRewards
                            showModal={() => this.updateMultiplePromosModal(true)}
                            availableCash={availableCash}
                            appliedValue={appliedValue}
                            infoModalCallback={infoModalCallback}
                            promos={promos}
                            onApply={this.applyToBasket}
                            onRemove={this.removeFromBasket}
                            isApplied={promos.some(({ isApplied }) => isApplied)}
                            userCBRPoints={biPoints}
                            isFrictionlessCheckoutEnabled={frictionlessCheckout?.global?.isEnabled}
                        />
                    )}
                </Box>
                <MultiplePromosModal
                    isOpen={this.state.multiplePromosModalIsOpen}
                    onDismiss={() => this.updateMultiplePromosModal(false)}
                    biPoints={biPoints}
                    promos={promos}
                    onApply={this.applyToBasket}
                    onRemove={this.removeFromBasket}
                    subtotal={subtotal}
                    rawSubTotal={rawSubTotal}
                    error={error}
                    isFrictionlessCheckoutEnabled={frictionlessCheckout?.global?.isEnabled}
                />
            </>
        );
    }
}

export default wrapComponent(CashBackRewards, 'CashBackRewards', true);
