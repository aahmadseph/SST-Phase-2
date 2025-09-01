/* eslint-disable class-methods-use-this */
import React from 'react';
import framework from 'utils/framework';
const { wrapComponent } = framework;
import BaseClass from 'components/BaseClass';
import {
    Container, Box, Text, Grid, Button
} from 'components/ui';
import Banner from 'components/Content/Banner';
import contentConstants from 'constants/content';
import dateUtils from 'utils/Date';
import Barcode from 'components/Barcode/Barcode';
import Action from 'components/Content/Action';
import Copy from 'components/Content/Copy';
import ComponentList from 'components/Content/ComponentList';
import anaConsts from 'analytics/constants';

const ActionButton = Action(Button);
const { BANNER_TYPES } = contentConstants;

class TargetedLandingContent extends BaseClass {
    render() {
        const {
            heroBanner, seo = {}, promoDescription, offerVariation, offerText, couponCode, onlineOnly, content, ctaAction
        } = this.props.data;
        const { promoStartDate, promoEndDate } = this.props;
        const {
            redeemOnline, redemptionInstructions, scanInStoreToRedeem, shopNow, valid
        } = this.props.locales;
        const { firstName } = this.props.user;

        const firstNameCaplitalized = firstName && firstName.charAt(0).toUpperCase() + firstName.slice(1);
        const parsedPromoStartDate = promoStartDate && dateUtils.getDateInMDDShortMonthFormat(promoStartDate.substr(0, 10), false);
        const parsedPromoEndDate = promoEndDate && dateUtils.getDateInMDDShortMonthFormat(promoEndDate.substr(0, 10), true);

        return (
            <Container paddingX={[0, 4]}>
                {heroBanner?.[0] && (
                    <Banner
                        {...heroBanner[0]}
                        bannerType={BANNER_TYPES.HERO}
                        seoHeader={seo?.header1}
                        marginTop={[0, 5]}
                        marginBottom={[6, 7]}
                        alignLeft
                        enablePageRenderTracking={true}
                    />
                )}
                <Box
                    paddingX={[4, 0]}
                    paddingBottom={[5, 6]}
                >
                    <Grid
                        columns={[0, 2]}
                        gap={0}
                    >
                        <Box paddingRight={[0, 1]}>
                            {this.props.user?.firstName && (
                                <Text
                                    is='p'
                                    fontWeight='bold'
                                    fontSize='2xl'
                                    children={`${firstNameCaplitalized},`}
                                />
                            )}
                            {promoDescription && (
                                <Copy
                                    content={promoDescription}
                                    marginTop={[4, 3]}
                                    marginBottom={0}
                                />
                            )}
                            {offerVariation && (
                                <Copy
                                    content={offerVariation}
                                    marginTop={5}
                                    marginBottom={0}
                                />
                            )}
                            {offerText && (
                                <Copy
                                    content={offerText}
                                    marginTop={1}
                                    marginBottom={0}
                                />
                            )}
                            {parsedPromoStartDate && parsedPromoEndDate && (
                                <Text
                                    is='p'
                                    fontSize='sm'
                                    marginTop={1}
                                    children={`${valid} ${parsedPromoStartDate} - ${parsedPromoEndDate}`}
                                />
                            )}
                        </Box>
                        <Box
                            borderLeft={[0, '1px solid lightGray']}
                            marginTop={[5, 0]}
                        >
                            <Box marginLeft={[0, 7]}>
                                <Text
                                    is='h3'
                                    children={redemptionInstructions}
                                    fontWeight='bold'
                                    fontSize='md'
                                />
                                {couponCode && (
                                    <>
                                        <Text
                                            is='p'
                                            marginTop={2}
                                        >
                                            {redeemOnline}
                                            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{couponCode}</span>
                                        </Text>
                                        {!onlineOnly && (
                                            <>
                                                <Text
                                                    is='p'
                                                    marginTop={2}
                                                    marginBottom={!onlineOnly && 4}
                                                    children={scanInStoreToRedeem}
                                                />
                                                <Barcode
                                                    id={couponCode}
                                                    code={'CODE128'}
                                                    hasBorder={true}
                                                    barcodeDataAt='tlp_barcode'
                                                    labelDataAt='tlp_coupon'
                                                    showLabel={false}
                                                    flexDirection='row'
                                                    isCenter={false}
                                                />
                                            </>
                                        )}

                                        <ActionButton
                                            variant='primary'
                                            children={shopNow}
                                            width='100%'
                                            marginTop={5}
                                            maxWidth={['100%', 260]}
                                            analyticsNextPageData={{
                                                linkData: anaConsts.LinkData.TLP_SHOP_NOW
                                            }}
                                            action={ctaAction}
                                        />
                                    </>
                                )}
                            </Box>
                        </Box>
                    </Grid>
                </Box>
                {content?.length && (
                    <Box paddingX={[4, 0]}>
                        <ComponentList items={content} />
                    </Box>
                )}
            </Container>
        );
    }
}

export default wrapComponent(TargetedLandingContent, 'TargetedLandingContent', true);
