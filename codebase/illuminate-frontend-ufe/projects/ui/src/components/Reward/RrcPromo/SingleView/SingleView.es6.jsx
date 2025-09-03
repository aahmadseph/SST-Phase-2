import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    Grid, Text, Box, Image
} from 'components/ui';
import ErrorMessage from 'components/Reward/LoyaltyPromo/ErrorMessage';
import PromoCta from 'components/Reward/LoyaltyPromo/PromoCta';
import localeUtils from 'utils/LanguageLocale';
import Markdown from 'components/Markdown/Markdown';
import promoUtils from 'utils/Promos';
import dateUtils from 'utils/Date';
import InfoButton from 'components/InfoButton/InfoButton';
import Tooltip from 'components/Tooltip/Tooltip';

const getText = localeUtils.getLocaleResourceFile('components/Reward/RrcPromo/locales', 'RrcPromo');

class SingleView extends BaseClass {
    state = {
        differentCountryMessage: null
    };

    handleApply = coupon => {
        const differentCountry = localeUtils.getCurrentCountry().toUpperCase() !== coupon.country.toUpperCase();

        if (differentCountry) {
            const differentCountryMessage = localeUtils.isCanada() ? getText('switchToUS') : getText('switchToCA');
            this.setState({ differentCountryMessage: differentCountryMessage });
        } else {
            this.setState({ differentCountryMessage: null });
            promoUtils.applyPromo(coupon.couponCode.toLowerCase(), null, promoUtils.CTA_TYPES.RRC);
        }
    };

    render() {
        const {
            appliedPromotions, coupon, promo, applyConfig, contentAfter, iconGap, isBopis, isSddOrder, ...props
        } = this.props;

        const { differentCountryMessage } = this.state;

        const option = {
            isApplied: !isBopis && !isSddOrder && appliedPromotions.some(x => x.couponCode?.toLowerCase() === coupon.couponCode?.toLowerCase()),
            localizedDiscountAmount: `$${coupon.denomination}`,
            displayName: 'Rouge Rewards',
            promotionType: promoUtils.PROMO_TYPES.RRC,
            isEligible: !isBopis && !isSddOrder
        };

        const error = promoUtils.extractError(promo, [promoUtils.CTA_TYPES.RRC]);
        const errorMessage = error?.errorMessages?.length ? error.errorMessages.join(' ') : null;
        const errorPromoCode = error?.promoCode ? error.promoCode.toLowerCase() : null;
        const errorMessageProps = {
            couponCode: option.couponCode,
            errorMessage: differentCountryMessage || errorMessage,
            errorPromoCode: differentCountryMessage ? option.couponCode : errorPromoCode
        };

        const applyMessage = option.isApplied
            ? getText('applied', [coupon.denomination])
            : getText('expires', [coupon.denomination, dateUtils.getDateInMMDDYYFormat(coupon.expirationDate)]);

        return (
            <>
                <Box
                    lineHeight='tight'
                    paddingY={3}
                    {...props}
                >
                    <Grid
                        columns='auto 1fr auto'
                        gap={iconGap}
                        alignItems='center'
                    >
                        <Image
                            size={32}
                            src={'/img/ufe/icons/rouge-rewards.svg'}
                        />
                        <div>
                            <Text
                                is='h2'
                                display='inline-block'
                                numberOfLines={3}
                                fontWeight='bold'
                            >
                                {getText('applyText')}{' '}
                                <Text
                                    numberOfLines={1}
                                    paddingRight={5}
                                >
                                    {getText('rewardsText')}
                                    <Tooltip content={getText('infoText')}>
                                        <InfoButton
                                            padding={0}
                                            marginLeft={1}
                                        />
                                    </Tooltip>
                                </Text>
                            </Text>
                            <Markdown
                                content={applyMessage}
                                onPostParse={html => html.substring(3, html.length - 5)}
                            />
                        </div>
                        <PromoCta
                            option={option}
                            onApply={() => this.handleApply(coupon)}
                            onRemove={() => promoUtils.removePromo(coupon.couponCode.toLowerCase(), promoUtils.CTA_TYPES.RRC)}
                            applyConfig={applyConfig}
                            removeConfig={{
                                fontSize: 'sm',
                                textAlign: 'right'
                            }}
                        />
                    </Grid>
                    <ErrorMessage {...errorMessageProps} />
                </Box>
                {contentAfter}
            </>
        );
    }
}

SingleView.defaultProps = {
    errorMessage: null,
    errorPromoCode: null
};

export default wrapComponent(SingleView, 'SingleView');
