import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import Chevron from 'components/Chevron';
import {
    Box, Grid, Divider, Text, Image
} from 'components/ui';
import { colors } from 'style/config';
import Markdown from 'components/Markdown/Markdown';
import promoUtils from 'utils/Promos';
import localeUtils from 'utils/LanguageLocale';

import PromoCta from 'components/Reward/LoyaltyPromo/PromoCta';
import dateUtils from 'utils/Date';
import ErrorMessage from 'components/Reward/LoyaltyPromo/ErrorMessage';
import InfoButton from 'components/InfoButton/InfoButton';
import Tooltip from 'components/Tooltip/Tooltip';

const getText = localeUtils.getLocaleResourceFile('components/Reward/RrcPromo/locales', 'RrcPromo');

class MultipleView extends BaseClass {
    state = {
        isExpanded: false,
        differentCountryCouponCode: null
    };

    expandRewardSection = isOpen => {
        const onExpand = this.props.onExpand;
        isOpen && onExpand && onExpand();
        this.setState({ isExpanded: isOpen });
    };

    handleApply = coupon => {
        const differentCountry = localeUtils.getCurrentCountry().toUpperCase() !== coupon.country.toUpperCase();

        if (differentCountry) {
            this.setState({ differentCountryCouponCode: coupon.couponCode.toLowerCase() });
        } else {
            this.setState({ differentCountryCouponCode: null });
            promoUtils.applyPromo(coupon.couponCode.toLowerCase(), null, promoUtils.CTA_TYPES.RRC);
        }
    };

    renderList = (coupons, appliedCoupon, promo, isBopis, isSddOrder, differentCountryCouponCode) => {
        const anyApplied = Boolean(appliedCoupon);
        const error = promoUtils.extractError(promo, [promoUtils.CTA_TYPES.RRC]);
        const errorMessage = error?.errorMessages?.length ? error.errorMessages.join(' ') : null;
        const errorPromoCode = error?.promoCode ? error.promoCode.toLowerCase() : null;
        const differentCountryMessage = localeUtils.isCanada() ? getText('switchToUS') : getText('switchToCA');

        const list = coupons.map((coupon, index) => {
            const currentApplied = appliedCoupon?.couponCode?.toLowerCase() === coupon.couponCode.toLowerCase();
            const notEligble = isBopis || isSddOrder || (anyApplied && !currentApplied);
            const option = {
                isApplied: !isBopis && !isSddOrder && currentApplied,
                localizedDiscountAmount: `$${coupon.denomination}`,
                displayName: 'Rouge Rewards',
                promotionType: promoUtils.PROMO_TYPES.RRC,
                isEligible: !notEligble
            };

            return (
                <React.Fragment key={`${coupon.couponCode}`}>
                    {index > 0 && <Divider marginY={3} />}
                    <Grid
                        columns='1fr auto'
                        alignItems='center'
                        justifyContent='space-between'
                    >
                        <div>
                            <strong>{getText('rougeReward', [coupon.denomination])}</strong>
                            <br />
                            {getText('expiresDate', [dateUtils.getDateInMMDDYYFormat(coupon.expirationDate)])}
                        </div>
                        <PromoCta
                            option={option}
                            onApply={() => this.handleApply(coupon)}
                            onRemove={() => promoUtils.removePromo(coupon.couponCode.toLowerCase(), promoUtils.CTA_TYPES.RRC)}
                            applyConfig={this.props.applyConfig}
                            removeConfig={{
                                textAlign: 'right'
                            }}
                        />
                    </Grid>
                    <ErrorMessage
                        data-at={Sephora.debug.dataAt('rrc_error_msg')}
                        couponCode={coupon.couponCode}
                        errorMessage={differentCountryCouponCode ? differentCountryMessage : errorMessage}
                        errorPromoCode={differentCountryCouponCode || errorPromoCode}
                    />
                </React.Fragment>
            );
        });

        return list;
    };

    render() {
        const id = 'rrc_promos';
        const { isExpanded, differentCountryCouponCode } = this.state;
        const {
            // eslint-disable-next-line no-unused-vars
            applyConfig,
            appliedPromotions,
            coupons,
            promo,
            iconGap,
            contentAfter,
            paddingX,
            marginX,
            borderColor,
            isBopis,
            isSddOrder,
            ...props
        } = this.props;

        const appliedCouponCodes = appliedPromotions.map(x => x.couponCode.toLowerCase());
        const appliedCoupon = coupons.find(x => appliedCouponCodes.indexOf(x.couponCode.toLowerCase()) >= 0);

        return (
            <>
                <Box
                    lineHeight='tight'
                    borderColor={isExpanded ? 'black' : borderColor}
                    baseCss={{ '&:hover': { borderColor: colors.black } }}
                    {...props}
                >
                    <Grid
                        onClick={() => this.expandRewardSection(!isExpanded)}
                        paddingY={3}
                        paddingX={paddingX}
                        marginX={marginX}
                        aria-controls={id}
                        aria-expanded={isExpanded}
                        columns='auto 1fr auto'
                        gap={iconGap}
                        alignItems='center'
                        css={{
                            outline: 0,
                            '&:focus .Collapse-target': {
                                textDecoration: 'underline'
                            }
                        }}
                    >
                        <Image
                            size={32}
                            src='/img/ufe/icons/rouge-rewards.svg'
                        />
                        <div>
                            <Text
                                is='h2'
                                display='inline-block'
                                fontWeight='bold'
                                className='Collapse-target'
                                children={`${getText('applyText')} ${getText('rewardsText')}`}
                            />
                            <Tooltip content={getText('infoText')}>
                                <InfoButton marginLeft={-1} />
                            </Tooltip>
                            {appliedCoupon && !isBopis && (
                                <Markdown
                                    fontSize='sm'
                                    onPostParse={html => html.substring(3, html.length - 5)}
                                    content={getText('applied', [appliedCoupon.denomination])}
                                />
                            )}
                        </div>
                        <Chevron direction={isExpanded ? 'up' : 'down'} />
                    </Grid>
                    <Box
                        id={id}
                        paddingBottom={3}
                        paddingX={paddingX}
                        marginX={marginX}
                        style={!isExpanded ? { display: 'none' } : null}
                    >
                        {this.renderList(coupons, appliedCoupon, promo, isBopis, isSddOrder, differentCountryCouponCode)}
                    </Box>
                </Box>
                {contentAfter}
            </>
        );
    }
}

export default wrapComponent(MultipleView, 'MultipleView');
