/* eslint-disable complexity */

import React from 'react';
import { space } from 'style/config';
import {
    Box, Flex, Image, Text, Divider, Button
} from 'components/ui';
import analyticsUtils from 'analytics/utils';
import BaseClass from 'components/BaseClass';
import BasketUtils from 'utils/Basket';
import BCC from 'utils/BCC';
import InfoButton from 'components/InfoButton/InfoButton';
import localeUtils from 'utils/LanguageLocale';
import resourceWrapper from 'utils/framework/resourceWrapper';
import store from 'store/Store';
import TermsAndConditionsActions from 'actions/TermsAndConditionsActions';
import { wrapComponent } from 'utils/framework';

class BeautyInsiderCash extends BaseClass {
    static onInfoIconClick(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        const mediaId = BCC.MEDIA_IDS.CASH_BACK_REWARDS_MODAL_CONTENT;
        store.dispatch(TermsAndConditionsActions.showModal(true, mediaId, ''));
    }

    static getEligibleDollarValue(eligibleValue, getText) {
        const isDesktop = Sephora.isDesktop();
        const isFrench = localeUtils.isFrench();
        const eligibleValueNum = Number(BasketUtils.removeCurrency(eligibleValue));

        const dollarSign = (
            <Text
                key='dollarSign'
                verticalAlign='super'
                fontSize='.4em'
                children={'$'}
            />
        );

        return (
            <Text
                is='p'
                lineHeight='none'
                fontSize={80}
                fontFamily='serif'
                marginLeft={isDesktop && '-.25em'}
                letterSpacing='-.025em'
            >
                {isFrench || dollarSign}
                {eligibleValueNum}
                {isFrench && dollarSign}
                <Text
                    letterSpacing='normal'
                    fontSize='3xl'
                    children={` ${getText('off')}`}
                />
            </Text>
        );
    }

    static getDenominationsList(availablePromotions = [], getText) {
        return (
            <Box
                backgroundColor='nearWhite'
                borderRadius={2}
                key='BICashDenominationsList'
                paddingY={3}
                paddingX={5}
            >
                <Text
                    is='h3'
                    fontWeight='bold'
                    children={getText('BICashOptions')}
                />
                {availablePromotions.map(promo => (
                    <React.Fragment key={promo.value}>
                        <Divider marginY={3} />
                        <div>
                            <strong>{`${promo.value} ${getText('off')}:`}</strong> {`${promo.point} points`}
                        </div>
                    </React.Fragment>
                ))}
            </Box>
        );
    }

    render() {
        if (!this.props.biCashOptions) {
            return null;
        }

        const {
            eligiblePoint, eligibleValue, eligibleCBRCount, missingPoints, thresholdValue, availablePromotions
        } = this.props.biCashOptions;

        if (!availablePromotions || !availablePromotions.length || !eligibleValue || !eligiblePoint) {
            return null;
        }

        const getText = resourceWrapper(
            localeUtils.getLocaleResourceFile('components/RichProfile/BeautyInsider/BeautyInsiderCash/locales', 'BeautyInsiderCash')
        );

        const messages = [];

        if (eligibleCBRCount > 0) {
            // single or multiple options available
            messages[0] = (
                <Text
                    is='h3'
                    children={getText(eligibleCBRCount > 1 ? 'canApplyUpTo' : 'canApply', true, eligiblePoint)}
                />
            );
            messages[1] = BeautyInsiderCash.getEligibleDollarValue(eligibleValue, getText);
        } else {
            // if user is ${thresholdValue} points away or less from the lowest CBR available
            if (missingPoints <= thresholdValue) {
                messages[0] = getText(
                    'missingPointsClose',
                    true,
                    missingPoints,
                    missingPoints > 1 ? getText('pointsText') : getText('pointText'),
                    eligibleValue
                );
                messages[1] = getText('onceYouEarn', true, eligiblePoint, eligibleValue);
                // if user is more than ${thresholdValue} points away from the lowest CBR available
            } else {
                messages[0] = getText('onceYouEarn', true, eligiblePoint, eligibleValue);
                messages[1] = getText('cashWillApplyHere');
            }

            messages[0] = (
                <Text
                    is='h3'
                    fontSize='md'
                    children={messages[0]}
                />
            );
            messages[1] = (
                <Text
                    is={'div'}
                    marginTop={4}
                    marginBottom={2}
                    children={messages[1]}
                />
            );
        }

        const isDesktop = Sephora.isDesktop();

        const [ctaLabel, ctaHref, ctaDataAt] =
            eligibleCBRCount > 0 ? ['applyInBasket', '/basket', 'bi_cash_apply_btn'] : ['shopToEarnPoints', '/', 'bi_cash_shop_btn'];

        const applyCTA = (
            <Button
                marginTop={4}
                block={!isDesktop}
                minWidth={isDesktop && '22em'}
                variant='secondary'
                data-at={Sephora.debug.dataAt(ctaDataAt)}
                href={ctaHref}
                children={getText(ctaLabel)}
                onClick={() => {
                    if (eligibleCBRCount > 0) {
                        const prop55 = 'bi:beauty insider cash:apply in basket';
                        analyticsUtils.setNextPageData({ linkData: prop55 });
                    }
                }}
            />
        );

        const hasMultiPromos = availablePromotions.length > 1;

        return (
            <React.Fragment>
                <Flex
                    marginBottom={isDesktop ? 6 : 5}
                    alignItems='baseline'
                    data-at={Sephora.debug.dataAt('bi_cash_title')}
                    justifyContent={isDesktop && 'center'}
                >
                    {isDesktop || (
                        <Image
                            css={{
                                alignSelf: 'center',
                                flexShrink: 0
                            }}
                            src='/img/ufe/icons/points-cash.svg'
                            marginRight={3}
                            size={24}
                        />
                    )}
                    <Text
                        is='h2'
                        fontFamily='serif'
                        fontSize={isDesktop ? '2xl' : 'xl'}
                        marginRight='.25em'
                        children={getText('BICash')}
                    />
                    <InfoButton onClick={BeautyInsiderCash.onInfoIconClick} />
                </Flex>
                <Box
                    lineHeight='tight'
                    {...(isDesktop && {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        maxWidth: 765,
                        marginX: 'auto'
                    })}
                >
                    <div
                        css={
                            isDesktop && [
                                {
                                    flex: 1,
                                    textAlign: 'center'
                                },
                                hasMultiPromos && {
                                    paddingRight: space[8]
                                }
                            ]
                        }
                    >
                        <Box
                            data-at={Sephora.debug.dataAt('bi_cash_message')}
                            marginBottom={isDesktop || (hasMultiPromos ? 4 : 3)}
                            textAlign={eligibleCBRCount ? null : 'center'}
                        >
                            {messages[0]}
                            {messages[1]}
                        </Box>
                        {isDesktop && applyCTA}
                    </div>
                    {(hasMultiPromos || !isDesktop) && (
                        <div css={isDesktop && { width: 311 }}>
                            {hasMultiPromos && BeautyInsiderCash.getDenominationsList(availablePromotions, getText)}
                            {isDesktop || applyCTA}
                        </div>
                    )}
                </Box>
            </React.Fragment>
        );
    }
}

export default wrapComponent(BeautyInsiderCash, 'BeautyInsiderCash');
