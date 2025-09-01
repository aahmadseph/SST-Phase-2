/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import {
    Box, Divider, Link, Text
} from 'components/ui';
import { wrapComponent } from 'utils/framework';
import CostSummaryBreakdown from 'components/FrictionlessCheckout/CostSummary/CostSummaryBreakdown';
import EstimatedTotalSection from 'components/FrictionlessCheckout/CostSummary/EstimatedTotalSection';
import PlaceOrderButton from 'components/FrictionlessCheckout/PlaceOrderButton';
import mediaUtils from 'utils/Media';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import { colors } from 'style/config';
import Markdown from 'components/Markdown/Markdown';
import { mediaQueries } from 'style/config';

const { Media } = mediaUtils;

class CostSummary extends BaseClass {
    render() {
        const canCheckoutPaze = Storage.local.getItem(LOCAL_STORAGE.CAN_CHECKOUT_PAZE);
        const {
            placeOrderLabel,
            isBopis,
            isSDUItemInBasket,
            hasPickupSubstituteItems,
            hasSameDaySubstituteItems,
            subtotal,
            locales: {
                bopisIncreasedAuthorizationWarning,
                sddIncreasedAuthorizationWarning,
                sddSubstituteDisclaimer,
                temporarilyAuthorized,
                forText,
                seeFullTerms,
                orderCostSummaryText
            }
        } = this.props;

        const textToShow = hasPickupSubstituteItems ? bopisIncreasedAuthorizationWarning : sddIncreasedAuthorizationWarning;

        return (
            <Box
                lineHeight='tight'
                boxShadow='light'
                borderRadius={2}
                aria-label={orderCostSummaryText}
                role='region'
            >
                <Box
                    paddingX={[3, 5]}
                    paddingY={3}
                >
                    <CostSummaryBreakdown {...this.props} />
                    <Divider marginY={3} />
                    <EstimatedTotalSection
                        {...this.props}
                        placeOrderLabel={placeOrderLabel}
                    />
                    <Media greaterThan='sm'>
                        <Box marginTop={4}>
                            <PlaceOrderButton
                                children={placeOrderLabel}
                                isBopis={isBopis}
                                canCheckoutPaze={canCheckoutPaze}
                                isSDUItemInBasket={isSDUItemInBasket}
                            />
                            {hasSameDaySubstituteItems && (
                                <Text
                                    is='p'
                                    color={colors.gray}
                                    fontSize='xs'
                                    marginTop={3}
                                >
                                    {sddSubstituteDisclaimer} <Text fontWeight='bold'>{temporarilyAuthorized}</Text>
                                    {` ${forText} `}
                                    <Text fontWeight='bold'>{`${subtotal}.`}</Text>{' '}
                                    <Link
                                        href='/beauty/terms-of-use'
                                        color={colors.blue}
                                    >
                                        {seeFullTerms}
                                    </Link>
                                </Text>
                            )}
                        </Box>
                    </Media>
                    {(hasSameDaySubstituteItems || hasPickupSubstituteItems) && (
                        <Link
                            color='gray'
                            css={styles.link}
                            fontSize='xs'
                            href='/beauty/terms-of-use'
                            target='_blank'
                        >
                            <Markdown
                                color={colors.gray}
                                fontSize='sm'
                                css={styles.authorization}
                                marginTop={3}
                                aria-label={textToShow}
                                content={textToShow}
                            />
                        </Link>
                    )}
                </Box>
            </Box>
        );
    }
}

const styles = {
    authorization: {
        span: {
            [mediaQueries.mdMax]: {
                display: 'none'
            }
        }
    },
    link: {
        '.no-touch &:hover': {
            textDecoration: 'none'
        }
    }
};

export default wrapComponent(CostSummary, 'CostSummary', true);
