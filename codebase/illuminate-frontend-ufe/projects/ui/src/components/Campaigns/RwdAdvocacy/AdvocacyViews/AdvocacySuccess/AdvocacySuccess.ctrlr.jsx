/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    Container, Box, Text, Grid, Button, Divider
} from 'components/ui';
import Barcode from 'components/Barcode/Barcode';
import Banner from 'components/Content/Banner';
import Copy from 'components/Content/Copy';
import contentConstants from 'constants/content';
import Action from 'components/Content/Action';
import dateUtils from 'utils/Date';
import rwdAdvocacyPageBindings from 'analytics/bindingMethods/pages/rwdAdvocacy/rwdAdvocacyPageBindings';

const ActionButton = Action(Button);
const { BANNER_TYPES } = contentConstants;

class AdvocacySuccess extends BaseClass {
    componentDidMount() {
        rwdAdvocacyPageBindings.setPageLoadAnaytics(this.props.pageType);
    }

    render() {
        const {
            seo,
            locales: {
                barcodeScan, redemptionInstructions, shopNow, yourNextPurchase, redeemOnline, valid
            },
            globalHeroBanner,
            globalInvitationText,
            successConfirmationText,
            successInstructions,
            successDiscountDescription,
            successDisclaimer,
            successCtaLink,
            successPromoStartDate,
            successPromoEndDate,
            successCouponCode,
            referrerFirstName
        } = this.props;

        const { firstName } = this.props.user || {};

        const parsedPromoStartDate = successPromoStartDate && dateUtils.getDateInMDDShortMonthFormat(successPromoStartDate.substr(0, 10), false);
        const parsedPromoEndDate = successPromoEndDate && dateUtils.getDateInMDDShortMonthFormat(successPromoEndDate.substr(0, 10), true);
        const firstNameCaplitalized = firstName && firstName.charAt(0).toUpperCase() + firstName.slice(1);

        return (
            <Container
                paddingX={[0, 4]}
                paddingBottom={0}
            >
                {globalHeroBanner?.[0] && (
                    <Banner
                        {...globalHeroBanner[0]}
                        bannerType={BANNER_TYPES.HERO}
                        seoHeader={seo?.header1}
                        marginTop={[0, 5]}
                        marginBottom={[6, 7]}
                        alignLeft
                        enablePageRenderTracking={true}
                    />
                )}
                <Box paddingX={[4, 0]}>
                    <Grid
                        columns={[0, 2]}
                        gap={0}
                    >
                        <Box paddingRight={[0, 1]}>
                            <Text
                                is='p'
                                data-at={Sephora.debug.dataAt('referrer_text')}
                                children={`${globalInvitationText} ${referrerFirstName}`}
                            />
                            {successConfirmationText && (
                                <Text
                                    is='p'
                                    fontWeight='bold'
                                    fontSize='2xl'
                                    marginTop={5}
                                    data-at={Sephora.debug.dataAt('promo_confirmation')}
                                    children={`${firstNameCaplitalized || ''}${successConfirmationText}`}
                                />
                            )}
                            {successInstructions && (
                                <Copy
                                    content={successInstructions}
                                    data-at={Sephora.debug.dataAt('redemption_instructions')}
                                    marginTop={[4, 3]}
                                    marginBottom={0}
                                />
                            )}
                            {successDiscountDescription && (
                                <Text
                                    is='p'
                                    fontWeight='bold'
                                    fontSize='2xl'
                                    marginTop={5}
                                    data-at={Sephora.debug.dataAt('promo_discount')}
                                    children={successDiscountDescription}
                                />
                            )}
                            <Text
                                is='p'
                                fontWeight='bold'
                                children={yourNextPurchase}
                                marginTop={1}
                            />
                            {parsedPromoStartDate && parsedPromoEndDate && (
                                <Text
                                    is='p'
                                    data-at={Sephora.debug.dataAt('promo_validity')}
                                    children={`${valid} ${parsedPromoStartDate} - ${parsedPromoEndDate}`}
                                    marginTop={1}
                                />
                            )}
                        </Box>
                        <Box
                            borderLeft={[0, '1px solid lightGray']}
                            marginTop={[5, 0]}
                        >
                            <Box marginLeft={[0, 7]}>
                                <Text
                                    is='h4'
                                    fontWeight='bold'
                                    children={`${redemptionInstructions}:`}
                                />
                                <Text
                                    is='p'
                                    marginTop={2}
                                >
                                    {`${redeemOnline} `}
                                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{successCouponCode}</span>
                                </Text>
                                <Text
                                    is='p'
                                    marginTop={2}
                                    marginBottom={4}
                                    children={barcodeScan}
                                />
                                <Barcode
                                    barcodeDataAt='promo_barcode'
                                    code={'CODE39'}
                                    id={successCouponCode}
                                    hasBorder={true}
                                    flexDirection='row'
                                    isCenter={false}
                                />
                                <ActionButton
                                    variant='primary'
                                    children={shopNow}
                                    width='100%'
                                    marginTop={5}
                                    data-at={Sephora.debug.dataAt('shop_now_btn')}
                                    maxWidth={['100%', 276]}
                                    action={successCtaLink}
                                />
                            </Box>
                        </Box>
                    </Grid>
                    {successDisclaimer && (
                        <>
                            <Divider
                                marginTop={[6, 7]}
                                marginBottom={[5, 4]}
                            />
                            <Copy
                                content={successDisclaimer}
                                marginTop={0}
                                marginBottom={0}
                            />
                        </>
                    )}
                </Box>
            </Container>
        );
    }
}

export default wrapComponent(AdvocacySuccess, 'AdvocacySuccess', true);
