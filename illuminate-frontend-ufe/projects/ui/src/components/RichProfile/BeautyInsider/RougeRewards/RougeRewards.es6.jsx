/* eslint-disable object-curly-newline */

import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { space } from 'style/config';
import { Grid, Box, Flex, Image, Text, Button, Divider, Link } from 'components/ui';
import Chevron from 'components/Chevron';
import Flag from 'components/Flag/Flag';
import Markdown from 'components/Markdown/Markdown';
import localeUtils from 'utils/LanguageLocale';

import dateUtils from 'utils/Date';
import anaConsts from 'analytics/constants';
import urlUtils from 'utils/Url';
import analyticsUtils from 'analytics/utils';

const getText = localeUtils.getLocaleResourceFile('components/RichProfile/BeautyInsider/RougeRewards/locales', 'RougeRewards');
const {
    LinkData: { RRC_APPLY }
} = anaConsts;

class RougeRewards extends BaseClass {
    isDesktop = Sephora.isDesktop();
    isFrench = localeUtils.isFrench();
    state = {
        isExpanded: false
    };

    render() {
        const { availableRrcCoupons } = this.props;

        if (!availableRrcCoupons || availableRrcCoupons.length === 0) {
            return null;
        }

        const mainCoupon = availableRrcCoupons.slice().sort((a, b) => b.denomination - a.denomination)[0];
        const couponsSortedByExpiration = availableRrcCoupons.slice().sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate));

        return (
            <div>
                <Grid
                    alignItems='baseline'
                    marginBottom={[5, 7]}
                    lineHeight='none'
                    columns={['auto 1fr auto', '1fr auto 1fr']}
                >
                    <Box alignSelf='center'>
                        <Image
                            display={[null, 'none']}
                            src='/img/ufe/icons/rouge-rewards.svg'
                            size={24}
                        />
                    </Box>
                    <Text
                        is='h2'
                        fontFamily='serif'
                        textAlign={[null, 'center']}
                        fontSize={['xl', '2xl']}
                        data-at={Sephora.debug.dataAt('rrc_section_title')}
                        children={getText('rougeRewards')}
                    />
                </Grid>
                <Box
                    lineHeight='tight'
                    {...(this.isDesktop && {
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
                            this.isDesktop && {
                                flex: 1,
                                alignSelf: 'flex-start',
                                paddingLeft: space[8],
                                paddingRight: space[6]
                            }
                        }
                    >
                        {availableRrcCoupons.length === 1 && this.renderDate(mainCoupon.expirationDate)}
                        {this.renderContent({
                            denomination: mainCoupon.denomination
                        })}
                        {this.isDesktop && this.renderCallToAction()}
                    </div>
                    <div
                        css={this.isDesktop && { width: 311 }}
                        data-at={Sephora.debug.dataAt('rrc_event_details_section')}
                    >
                        {this.renderDetails({
                            items: couponsSortedByExpiration
                        })}
                        <Text
                            is='p'
                            marginTop={4}
                            fontSize='sm'
                            {...(this.isDesktop && {
                                textAlign: 'center'
                            })}
                            color={'gray'}
                        >
                            {getText('rougeRewardsAreNonrefundable')}
                        </Text>
                        {this.isDesktop || this.renderCallToAction()}
                    </div>
                </Box>
            </div>
        );
    }

    renderDate = expirationDate => {
        const date = dateUtils.getDateInWeekdayMonthDayFormat(expirationDate);

        return (
            <Flex
                data-at={Sephora.debug.dataAt('rrc_end_date')}
                marginBottom={4}
            >
                <Flag children={getText('expires', [date])} />
            </Flex>
        );
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

    getEligibleDollarValue = denomination => {
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
                textAlign={'center'}
                lineHeight='none'
                fontSize={80}
                fontFamily='serif'
                marginLeft={this.isDesktop && '-.25em'}
                letterSpacing='-.025em'
            >
                {this.isFrench || dollarSign}
                {denomination}
                {this.isFrench && dollarSign}
                <Text
                    letterSpacing='normal'
                    fontSize='3xl'
                    children={` ${getText('off')}`}
                />
            </Text>
        );
    };

    renderContent = options => {
        return (
            <React.Fragment>
                <Text
                    is='p'
                    {...(this.isDesktop && {
                        textAlign: 'center',
                        maxWidth: '22em'
                    })}
                    data-at={Sephora.debug.dataAt('rrc_eligible_for_label')}
                    children={getText('youCanNowApply')}
                />
                {this.getEligibleDollarValue(options.denomination)}
            </React.Fragment>
        );
    };

    renderSingleDetails = item => {
        return (
            <>
                <Text is='p'>{getText('toUseYourRewards')}</Text>
                <Text
                    is='p'
                    marginTop={2}
                    fontSize='md'
                >
                    <strong>{item.couponCode}</strong>
                </Text>
            </>
        );
    };

    renderMultipleDetails = items => {
        const { isExpanded } = this.state;
        const hasMore = items.length > 3;
        const itemsToShow = hasMore && !isExpanded ? items.slice(0, 3) : items;

        return (
            <>
                <Text
                    is='h3'
                    fontWeight='bold'
                    children={getText('availableRewards')}
                />
                {itemsToShow.map(x => (
                    <div
                        key={`rrc_${x.couponCode}_denomination`}
                        data-at={Sephora.debug.dataAt('rrc_denomination_label')}
                    >
                        <Divider marginY={3} />
                        <Text is='p'>
                            <strong>{`${this.isFrench ? `${x.denomination} $` : `$${x.denomination}`} ${getText('off')}:`}</strong>{' '}
                            {getText('expires', [dateUtils.getDateInMMDDYYFormat(x.expirationDate)])}
                        </Text>
                        <Markdown content={getText('usePromoCode', [x.couponCode])} />
                    </div>
                ))}
                {hasMore && (
                    <div data-at={Sephora.debug.dataAt('rrc_viewMore')}>
                        <Divider marginY={3} />
                        <Link
                            data-at={Sephora.debug.dataAt('rrc_viewMore_link')}
                            onClick={() => this.handleViewMore()}
                        >
                            <Text
                                paddingRight={1}
                                children={isExpanded ? getText('viewLess') : getText('viewMore')}
                            />
                            <Chevron direction={isExpanded ? 'up' : 'down'} />
                        </Link>
                    </div>
                )}
            </>
        );
    };

    renderDetails = options => {
        return (
            <Box
                backgroundColor='nearWhite'
                paddingX={4}
                paddingY={3}
                data-at={Sephora.debug.dataAt('rrc_event_details_label')}
                borderRadius={2}
            >
                {options.items.length === 1 ? this.renderSingleDetails(options.items[0]) : this.renderMultipleDetails(options.items)}
            </Box>
        );
    };

    renderCallToAction = () => {
        const applyCTA = (
            <Button
                marginTop={4}
                block={!this.isDesktop}
                minWidth={this.isDesktop && '22em'}
                variant='secondary'
                data-at={Sephora.debug.dataAt('rrc_apply_in_basket')}
                onClick={() => this.handleApplyClick()}
                children={getText('apply')}
            />
        );

        return applyCTA;
    };
}

export default wrapComponent(RougeRewards, 'RougeRewards');
