/* eslint-disable object-curly-newline */

import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import store from 'store/Store';
import Actions from 'Actions';
import { space } from 'style/config';
import { Grid, Link, Box, Flex, Image, Text, Button, Divider } from 'components/ui';
import Flag from 'components/Flag/Flag';
import Markdown from 'components/Markdown/Markdown';
import helperUtils from 'utils/Helpers';
import urlUtils from 'utils/Url';
import analyticsUtils from 'analytics/utils';
import IconCheckmark from 'components/LegacyIcon/IconCheckmark';
import anaConsts from 'analytics/constants';
import bccUtils from 'utils/BCC';
import localeUtils from 'utils/LanguageLocale';

const { replaceDoubleAsterisks } = helperUtils;
const {
    LinkData: { PFD_APPLY }
} = anaConsts;

const {
    MEDIA_IDS: { POINTS_FOR_DISCOUNT_MODAL }
} = bccUtils;

const getText = localeUtils.getLocaleResourceFile('components/RichProfile/BeautyInsider/PointsForDiscount/locales', 'PointsForDiscount');

class PointsForDiscount extends BaseClass {
    isDesktop = Sephora.isDesktop();
    isFrench = localeUtils.isFrench();

    constructor(props) {
        super(props);
        this.state = {
            availablePFDPromotions: this.props.availablePFDPromotions,
            eligiblePoint: this.props.eligiblePoint
        };
    }

    render() {
        const { availablePFDPromotions, biPercentageOffHeading, eligiblePoint, eligibleValue, pfdPromoEndDate } = this.props;

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
                            src='/img/ufe/icons/points-discount.svg'
                            size={24}
                        />
                    </Box>
                    <Text
                        is='h2'
                        fontFamily='serif'
                        textAlign={[null, 'center']}
                        fontSize={['xl', '2xl']}
                        data-at={Sephora.debug.dataAt('pfd_section_title')}
                        children={getText('pointsForDiscountEventTitle')}
                    />
                    <Flex justifyContent='flex-end'>
                        <Link
                            padding={2}
                            margin={-2}
                            arrowDirection='right'
                            children={getText('details')}
                            data-at={Sephora.debug.dataAt('pfd_details_link')}
                            onClick={PointsForDiscount.triggerPointsForDiscountModal}
                        />
                    </Flex>
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
                                paddingLeft: space[8],
                                paddingRight: space[6]
                            }
                        }
                    >
                        {PointsForDiscount.renderDate({ pfdPromoEndDate })}
                        {PointsForDiscount.renderContent({
                            eligiblePoint,
                            eligibleValue,
                            isFrench: this.isFrench
                        })}
                        {this.isDesktop && this.renderCallToAction()}
                    </div>
                    <div
                        css={this.isDesktop && { width: 311 }}
                        data-at={Sephora.debug.dataAt('pfd_event_details_section')}
                    >
                        {PointsForDiscount.renderDetails({
                            biPercentageOffHeading,
                            availablePFDPromotions
                        })}
                        {this.isDesktop || this.renderCallToAction()}
                    </div>
                </Box>
            </div>
        );
    }

    static triggerPointsForDiscountModal() {
        store.dispatch(
            Actions.showMediaModal({
                isOpen: true,
                titleDataAt: 'pfd_modal_title',
                mediaId: POINTS_FOR_DISCOUNT_MODAL,
                title: getText('pointsForDiscountEventTitle'),
                modalBodyDataAt: 'pfd_modal_info',
                dismissButtonText: getText('gotIt'),
                dismissButtonDataAt: 'pfd_modal_got_it_btn',
                modalDataAt: 'pfd_modal',
                modalCloseDataAt: 'pfd_modal_close_btn'
            })
        );
    }

    static handleApplyClick() {
        const prop55 = PFD_APPLY;
        analyticsUtils.setNextPageData({
            pageName: digitalData.page.attributes.sephoraPageInfo.pageName,
            pageType: digitalData.page.category.pageType,
            linkData: prop55
        });
        urlUtils.redirectTo('/basket');
    }

    static renderDate(options) {
        return (
            <Flex
                data-at={Sephora.debug.dataAt('pm_end_date')}
                marginBottom={4}
            >
                <Flag children={getText('ends', [options.pfdPromoEndDate])} />
            </Flex>
        );
    }

    static renderContent(options) {
        return (
            <React.Fragment>
                <div data-at={Sephora.debug.dataAt('pfd_eligible_for_label')}>{getText('eligible')}</div>
                <Text
                    is='p'
                    display='flex'
                    css={{ alignItems: 'baseline' }}
                    lineHeight='none'
                    fontSize={options.isFrench ? 72 : 80}
                    marginBottom={4}
                    marginTop='-.125em'
                    data-at={Sephora.debug.dataAt('max_pfd_eligible_value')}
                >
                    <Text
                        fontFamily='serif'
                        letterSpacing='-.025em'
                    >
                        {options.eligibleValue.replace('%', '')}
                        <Text
                            fontSize={options.isFrench ? 52 : 60}
                            children='%'
                        />
                    </Text>
                    <Text
                        fontFamily='serif'
                        marginLeft={2}
                        fontSize={options.isFrench ? 'lg' : '2xl'}
                        children={getText('off')}
                    />
                    <Text
                        fontSize='base'
                        marginLeft={2}
                    >
                        ({options.eligiblePoint} {getText('points')})
                    </Text>
                </Text>
            </React.Fragment>
        );
    }

    static renderDetails(options) {
        return (
            <Box
                backgroundColor='nearWhite'
                paddingX={4}
                paddingY={3}
                data-at={Sephora.debug.dataAt('pfd_event_details_label')}
                borderRadius={2}
            >
                <Markdown content={replaceDoubleAsterisks(options.biPercentageOffHeading)} />
                {options.availablePFDPromotions.map(percentage => (
                    <div
                        data-at={Sephora.debug.dataAt('pfd_points_label')}
                        key={`pfd_${percentage.point}_level`}
                    >
                        <Divider marginY={3} />
                        <b>
                            {percentage.value} {getText('off')}:
                        </b>{' '}
                        {percentage.point} {getText('points')}
                    </div>
                ))}
            </Box>
        );
    }

    renderCallToAction = () => {
        return this.state.pointsApplied ? (
            <Button
                {...(this.isDesktop
                    ? { hasMinWidth: true }
                    : {
                        marginTop: 4,
                        block: true
                    })}
                variant='secondary'
                onClick={this.removePromo}
            >
                <div>
                    <Flex>
                        <IconCheckmark
                            fontSize='.875em'
                            marginRight={1}
                        />
                        <Text
                            fontWeight='bold'
                            children={getText('applied')}
                        />
                    </Flex>
                    <Link
                        color='blue'
                        padding={2}
                        margin={-2}
                        fontWeight='normal'
                        onClick={this.removePromo}
                        children={getText('remove')}
                    />
                </div>
            </Button>
        ) : (
            <Button
                {...(this.isDesktop
                    ? { hasMinWidth: true }
                    : {
                        marginTop: 4,
                        block: true
                    })}
                variant='secondary'
                onClick={() => {
                    PointsForDiscount.handleApplyClick();
                }}
                name='applyBtn'
                data-at={Sephora.debug.dataAt('pfd_apply_in_basket')}
                children={getText('apply')}
            />
        );
    };
}

export default wrapComponent(PointsForDiscount, 'PointsForDiscount');
