import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

import {
    Box, Flex, Link, Text
} from 'components/ui';

import Markdown from 'components/Markdown/Markdown';

import ButtonGrid from 'components/RwdBasket/RwdBasketLayout/CostSummary/Buttons/ButtonGrid';
import CostSummaryBreakdown from 'components/RwdBasket/RwdBasketLayout/CostSummary/CostSummaryBreakdown/CostSummaryBreakdown';
import KlarnaMarketing from 'components/Klarna/KlarnaMarketing';

import localeUtils from 'utils/LanguageLocale';
import mediaUtils from 'utils/Media';

import anaConsts from 'analytics/constants';

import { colors, fontSizes, fontWeights } from 'style/config';

const { getLocaleResourceFile } = localeUtils;
const { Media } = mediaUtils;

function BuyNowPayLater({
    replenishmentDiscountAmount,
    isSDUItemInBasket,
    isAfterpayCheckoutEnabled,
    isAfterpayEnabledForProfile,
    isKlarnaCheckoutEnabled,
    isPayPalPayLaterEligible,
    firstBuyDiscountTotal,
    subtotal,
    summaryDropdownDisplay,
    summaryDoubleDisplay
}) {
    const { afterpayEnabled: isAfterpayPaymentEnabled, isKlarnaPaymentEnabled } = Sephora.configurationSettings;

    const isAfterpayEnabled = isAfterpayPaymentEnabled && isAfterpayCheckoutEnabled && isAfterpayEnabledForProfile;
    const isKlarnaEnabled = isKlarnaPaymentEnabled && isKlarnaCheckoutEnabled;
    const isPayPalPayLaterEligibleEnabled = Sephora.configurationSettings.isPayPalEnabled && isPayPalPayLaterEligible;

    // If Klarna AND After pay are falsy OR any of the others then return null.
    if ((!isAfterpayEnabled && !isKlarnaEnabled) || isSDUItemInBasket || replenishmentDiscountAmount != null) {
        return null;
    }

    return (
        <KlarnaMarketing
            subtotal={subtotal}
            firstBuyDiscountTotal={firstBuyDiscountTotal}
            analyticsPageType={anaConsts.PAGE_TYPES.BASKET}
            analyticsContext={anaConsts.CONTEXT.BASKET_PAGE}
            isAfterpayEnabled={isAfterpayEnabled}
            isKlarnaEnabled={isKlarnaEnabled}
            isPayPalPayLaterEligibleEnabled={isPayPalPayLaterEligibleEnabled}
            summaryDropdownDisplay={summaryDropdownDisplay}
            summaryDoubleDisplay={summaryDoubleDisplay}
        />
    );
}

function SDUMessaging({
    getText, isUserSDUMember, isSDUItemInBasket, isSDDBasketAvailable, isSDUOnlyInBasket
}) {
    const isSDU = isUserSDUMember || isSDUItemInBasket;
    const hasSDDItem = isSDDBasketAvailable && !isSDUOnlyInBasket;

    if (!(isSDU && hasSDDItem)) {
        return null;
    }

    return (
        <Text
            is='p'
            fontSize='sm'
            color='green'
            data-at={Sephora.debug.dataAt('sdu_savings_label')}
        >
            {`${getText('youSave')} `}
            <strong children={getText(localeUtils.isCanada() ? 'sduSavingsCA' : 'sduSavingsUS')} />
            {` ${getText('withSDUUnlimited')}`}
        </Text>
    );
}

function EstimatedTotal({
    estimatedTotalFontSize,
    grossSubTotal,
    hasPickupSubstituteItems,
    hasSameDaySubstituteItems,
    totalItems,
    subtotal,
    getText,
    showXItems
}) {
    const showStar = hasPickupSubstituteItems || hasSameDaySubstituteItems;

    return (
        <Flex
            is='h4'
            alignItems='center'
            justifyContent='space-between'
            fontSize={estimatedTotalFontSize}
            fontWeight={fontWeights.bold}
        >
            <Text
                data-at={Sephora.debug.dataAt('total_label')}
                children={showXItems ? getText('estimatedTotalXItems', [totalItems]) : getText('estimatedTotal')}
            />
            <Box
                is='span'
                alignItems='baseline'
                display='inline-flex'
                gap={1}
            >
                {grossSubTotal && (
                    <Text
                        color={colors.gray}
                        fontWeight={fontWeights.normal}
                        css={{ textDecoration: 'line-through' }}
                        data-at={Sephora.debug.dataAt('bsk_total_without_discount_cc')}
                        children={showStar ? `${grossSubTotal}*` : grossSubTotal}
                    />
                )}
                <Text
                    data-at={Sephora.debug.dataAt('bsk_total_cc')}
                    children={showStar ? `${subtotal}*` : subtotal}
                />
            </Box>
        </Flex>
    );
}

function EstimatedTotalBox({
    getText,
    getApplePaymentStatus,
    isPaypalPayment,
    isVenmoEligible,
    grossSubTotal,
    subtotal,
    isBopis,
    totalItems,
    isAfterpayCheckoutEnabled,
    isAfterpayEnabledForProfile,
    isKlarnaCheckoutEnabled,
    firstBuyDiscountTotal,
    hasPickupSubstituteItems,
    hasSameDaySubstituteItems,
    isSDUItemInBasket,
    isSDDBasketAvailable,
    isUserSDUMember,
    isSDUOnlyInBasket,
    replenishmentDiscountAmount,
    isCheckoutDisabled,
    showShippingAndTaxes,
    isPayPalPayLaterEligible,
    isSignedIn,
    isRougeRewardsApplied,
    hideCheckoutButton,
    summaryDropdownDisplay,
    summaryDoubleDisplay
}) {
    const renderShippingTaxesText = (
        <Text
            is='p'
            color={colors.gray}
            fontSize={'sm'}
            data-at={Sephora.debug.dataAt('shipping_taxes_label')}
            children={getText(isBopis ? 'bopisTaxes' : 'shippingAndTaxes')}
        />
    );

    const renderSameDayIncreasedAuthorizationText = (
        <Markdown
            color={colors.gray}
            fontSize='sm'
            paddingTop='0.8rem'
            content={getText('sddIncreasedAuthorizationWarning')}
            aria-label={getText('sddIncreasedAuthorizationWarning')}
            tabIndex='0'
        />
    );

    const renderBopisIncreasedAuthorizationText = (
        <Markdown
            color={colors.gray}
            fontSize='sm'
            content={getText('bopisIncreasedAuthorizationWarning')}
            aria-label={getText('bopisIncreasedAuthorizationWarning')}
            tabIndex='0'
        />
    );

    const renderButtonGrid = (
        <ButtonGrid
            isBopis={isBopis}
            getApplePaymentStatus={getApplePaymentStatus}
            isPaypalPayment={isPaypalPayment}
            isVenmoEligible={isVenmoEligible}
            isCheckoutDisabled={isCheckoutDisabled}
            isSignedIn={isSignedIn}
            isSDDBasketAvailable={isSDDBasketAvailable}
            isSDUOnlyInBasket={isSDUOnlyInBasket}
            isRougeRewardsApplied={isRougeRewardsApplied}
            {...(hideCheckoutButton && { hideCheckoutButton: true })}
        />
    );

    const renderEstimatedTotal = ({ estimatedTotalFontSize, showXItems }) => (
        <EstimatedTotal
            grossSubTotal={grossSubTotal}
            totalItems={totalItems}
            subtotal={subtotal}
            getText={getText}
            hasPickupSubstituteItems={hasPickupSubstituteItems}
            hasSameDaySubstituteItems={hasSameDaySubstituteItems}
            estimatedTotalFontSize={estimatedTotalFontSize}
            showXItems={showXItems}
        />
    );

    const renderAboveBottomNav = () => {
        const bottomNavCalc = 'calc(var(--bottomNavHeight) - 1px)';

        return (
            <Media lessThan='lg'>
                <Flex
                    flexDirection='column'
                    data-height='bottomCostsummaryHeight'
                    gap={2}
                    position='fixed'
                    right={0}
                    bottom={[bottomNavCalc, bottomNavCalc, 0]}
                    left={0}
                    backgroundColor={colors.white}
                    zIndex={'var(--layer-flyout)'}
                    paddingX={4}
                    paddingY={2}
                    borderBottom={!summaryDropdownDisplay && `1px solid ${colors.lightGray}`}
                    boxShadow='0 -6px 6px -6px rgba(0, 0, 0, .2)'
                >
                    {renderEstimatedTotal({ estimatedTotalFontSize: fontSizes.base, showXItems: true })}
                    {!hideCheckoutButton && renderButtonGrid}
                </Flex>
            </Media>
        );
    };

    return (
        <>
            {renderAboveBottomNav()}
            <Flex
                flexDirection='column'
                gap={[2, 2, 2, 3]}
            >
                {renderEstimatedTotal({ estimatedTotalFontSize: fontSizes.md, showXItems: false })}
                <BuyNowPayLater
                    isAfterpayCheckoutEnabled={isAfterpayCheckoutEnabled}
                    isAfterpayEnabledForProfile={isAfterpayEnabledForProfile}
                    isKlarnaCheckoutEnabled={isKlarnaCheckoutEnabled}
                    isPayPalPayLaterEligible={isPayPalPayLaterEligible}
                    firstBuyDiscountTotal={firstBuyDiscountTotal}
                    subtotal={subtotal}
                    isSDUItemInBasket={isSDUItemInBasket}
                    replenishmentDiscountAmount={replenishmentDiscountAmount}
                    summaryDropdownDisplay={summaryDropdownDisplay}
                    summaryDoubleDisplay={summaryDoubleDisplay}
                />
                <Flex flexDirection='column'>
                    <SDUMessaging
                        getText={getText}
                        isUserSDUMember={isUserSDUMember}
                        isSDUItemInBasket={isSDUItemInBasket}
                        isSDDBasketAvailable={isSDDBasketAvailable}
                        isSDUOnlyInBasket={isSDUOnlyInBasket}
                    />
                    {showShippingAndTaxes && renderShippingTaxesText}
                    {hasSameDaySubstituteItems && renderSameDayIncreasedAuthorizationText}
                    {hasPickupSubstituteItems && renderBopisIncreasedAuthorizationText}
                </Flex>
                <Media at='lg'>{renderButtonGrid}</Media>
                {(hasSameDaySubstituteItems || hasPickupSubstituteItems) && (
                    <Link
                        color='gray'
                        css={{
                            '.no-touch &:hover': {
                                textDecoration: 'none'
                            }
                        }}
                        fontSize='xs'
                        href='/beauty/terms-of-use'
                        target='_blank'
                    >
                        <Markdown content={getText('maxAuthAmountMessage')} />
                    </Link>
                )}
            </Flex>
        </>
    );
}

function CostSummary({
    paymentInfo,
    showBasketGreyBackground,
    backgroundColor,
    hideCheckoutButton = false,
    summaryDropdownDisplay,
    summaryDoubleDisplay,
    hideSummary = false,
    toggleCostSummary,
    costSummaryCollapsed
}) {
    const getText = getLocaleResourceFile('components/RwdBasket/RwdBasketLayout/CostSummary/locales', 'CostSummary');

    return (
        <Flex
            flexDirection='column'
            borderRadius={2}
            width='100%'
            paddingX={4}
            paddingY={3}
            lineHeight='tight'
            boxShadow='light'
            order={[3, 1]}
            gap={3}
            data-at={Sephora.debug.dataAt('order_summary')}
            {...(showBasketGreyBackground && { backgroundColor: backgroundColor })}
            {...(summaryDoubleDisplay && hideCheckoutButton && { order: [4] })}
        >
            {costSummaryCollapsed && (
                <Box
                    borderBottom={`1px solid ${colors.lightGray}`}
                    padding={3}
                    paddingRight={1}
                    marginTop={-3}
                    lineHeight='tight'
                    textAlign='end'
                >
                    <Link
                        arrowPosition='after'
                        arrowDirection='down'
                        borderBottom={`1px solid ${colors.lightGray}`}
                        onClick={toggleCostSummary}
                    >
                        {getText('viewBasketSummary')}
                    </Link>
                </Box>
            )}
            {!hideSummary && !costSummaryCollapsed && (
                <Box borderBottom={`1px solid ${colors.lightGray}`}>
                    <CostSummaryBreakdown
                        {...paymentInfo}
                        hideCheckoutButton={hideCheckoutButton}
                    />
                </Box>
            )}
            <Box
                borderBottom='none'
                paddingBottom={0}
            >
                <EstimatedTotalBox
                    getText={getText}
                    hideCheckoutButton={hideCheckoutButton}
                    {...paymentInfo}
                    {...(summaryDropdownDisplay && { summaryDropdownDisplay })}
                />
            </Box>
        </Flex>
    );
}

export default wrapFunctionalComponent(CostSummary, 'CostSummary');
