/* eslint-disable class-methods-use-this */
import analyticsCnstants from 'analytics/constants';
import analyticsUtils from 'analytics/utils';
import BaseClass from 'components/BaseClass';
import Chevron from 'components/Chevron/Chevron';
import BeautyInsiderModuleLayout from 'components/Content/BeautyInsider/BeautyInsiderModuleLayout/BeautyInsiderModuleLayout';
import Flag from 'components/Flag/Flag';
import Markdown from 'components/Markdown/Markdown';
import {
    Box, Button, Divider, Link, Text
} from 'components/ui';
import React from 'react';
import dateUtils from 'utils/Date';
import localeUtils from 'utils/LanguageLocale';
import urlUtils from 'utils/Url';
import { wrapComponent } from 'utils/framework';
import Badge from 'components/Badge';
import { colors } from 'style/config';
import rougeExclusiveUtils from 'utils/rougeExclusive';

const getText = localeUtils.getLocaleResourceFile('components/Content/BeautyInsider/BeautyInsiderModules/RougeRewards/locales', 'RougeRewards');

const {
    LinkData: { RRC_APPLY }
} = analyticsCnstants;

class RougeRewards extends BaseClass {
    state = {
        isExpanded: false
    };

    handleViewMore = () => {
        this.setState({ isExpanded: !this.state.isExpanded });
    };

    handleApplyClick = () => {
        const prop55 = RRC_APPLY;
        analyticsUtils.setNextPageData({
            pageName: digitalData.page.attributes.sephoraPageInfo.pageName,
            pageType: digitalData.page.category.pageType,
            linkData: prop55
        });
        urlUtils.redirectTo('/basket');
    };

    leftContentZone = content => {
        const { expirationDate, denomination } = content;

        return (
            <Box width={['100%', 'auto']}>
                <Flag children={getText('ends', [dateUtils.getDateInWeekdayMonthDayFormat(expirationDate)])} />
                <Text
                    is='p'
                    marginTop={3}
                    children={getText('youCanNowApply')}
                />
                <Box
                    display='flex'
                    alignItems='baseline'
                >
                    <Text
                        is='h1'
                        fontSize={[32, 40]}
                        fontWeight='bold'
                        marginTop={1}
                        marginBottom={4}
                    >
                        {`$${denomination}`}
                        <Text
                            children={` ${getText('off')}`}
                            fontSize={24}
                        />
                    </Text>
                    {rougeExclusiveUtils.isRougeExclusive() && (
                        <Box
                            display='inline'
                            is='span'
                            marginLeft={2}
                        >
                            <Badge
                                badge={getText('rougeBadge')}
                                color={colors.red}
                            />
                        </Box>
                    )}
                </Box>
                <Button
                    variant='secondary'
                    hasMinWidth={true}
                    onClick={this.handleApplyClick}
                    name='applyBtn'
                    marginBottom={[4, 0]}
                    children={getText('apply')}
                    width={['100%', 'auto']}
                />
            </Box>
        );
    };

    renderSingleCoupon = ({ couponCode }) => {
        return (
            <Box padding={4}>
                <Text
                    is='h4'
                    fontWeight='bold'
                    children={getText('storeRedemption')}
                />
                <Divider marginY={3} />
                <Text
                    is='p'
                    children={getText('toUseYourRewards')}
                />
                <Text
                    is='p'
                    marginTop={3}
                    fontSize='md'
                    children={couponCode}
                    fontWeight='bold'
                />
            </Box>
        );
    };

    renderMultipleCoupons = coupons => {
        const { isExpanded } = this.state;
        const hasMore = coupons.length > 3;
        const itemsToShow = hasMore && !isExpanded ? coupons.slice(0, 3) : coupons;

        return (
            <Box padding={4}>
                <Text
                    is='h4'
                    fontWeight='bold'
                    children={getText('availableRewards')}
                />
                {itemsToShow.map(coupon => (
                    <div
                        key={`rrc_${coupon.couponCode}_denomination`}
                        data-at={Sephora.debug.dataAt('rrc_denomination_label')}
                    >
                        <Divider marginY={3} />
                        <Text is='p'>
                            <strong>{`${localeUtils.isFrench() ? `${coupon.denomination} $` : `$${coupon.denomination}`} off:`}</strong>{' '}
                            {getText('expires', [dateUtils.getDateInMMDDYYFormat(coupon.expirationDate)])}
                        </Text>
                        <Markdown content={getText('usePromoCode', [coupon.couponCode])} />
                    </div>
                ))}
                {hasMore && (
                    <div data-at={Sephora.debug.dataAt('rrc_viewMore')}>
                        <Divider marginY={3} />
                        <Link
                            data-at={Sephora.debug.dataAt('rrc_viewMore_link')}
                            onClick={this.handleViewMore}
                        >
                            <Text
                                paddingRight={1}
                                children={isExpanded ? getText('viewLess') : getText('viewMore')}
                            />
                            <Chevron direction={isExpanded ? 'up' : 'down'} />
                        </Link>
                    </div>
                )}
            </Box>
        );
    };

    rightContentZone = (isSingleCoupon, mainCoupon, couponsSortedByExpiration) => {
        return (
            <Box>
                <Box
                    backgroundColor='nearWhite'
                    height='fit-content'
                    borderRadius={2}
                >
                    {isSingleCoupon ? this.renderSingleCoupon(mainCoupon) : this.renderMultipleCoupons(couponsSortedByExpiration)}
                </Box>
                <Text
                    is='p'
                    fontSize='sm'
                    color='gray'
                    marginTop={3}
                    marginBottom={2}
                    children={getText('rougeRewardsAreNonrefundable')}
                />
            </Box>
        );
    };

    render() {
        const { coupons = [] } = this.props;
        const mainCoupon = this.props.coupons?.slice().sort((a, b) => b.denomination - a.denomination)[0];
        const isSingleCoupon = coupons?.length === 1;
        const couponsSortedByExpiration = coupons.slice().sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate));

        return (
            <BeautyInsiderModuleLayout
                title={getText('rougeRewards')}
                leftContentZone={this.leftContentZone(mainCoupon)}
                rightContentZone={this.rightContentZone(isSingleCoupon, mainCoupon, couponsSortedByExpiration)}
            />
        );
    }
}

export default wrapComponent(RougeRewards, 'RougeRewards');
