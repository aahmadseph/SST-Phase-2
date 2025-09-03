/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    Container, Box, Text, Grid, Button, Divider
} from 'components/ui';
import Banner from 'components/Content/Banner';
import Copy from 'components/Content/Copy';
import contentConstants from 'constants/content';
import userUtils from 'utils/User';
import rwdAdvocacyPageBindings from 'analytics/bindingMethods/pages/rwdAdvocacy/rwdAdvocacyPageBindings';
import { HEADER_VALUE } from 'constants/authentication';

const { BANNER_TYPES } = contentConstants;
const { setPageLoadAnaytics } = rwdAdvocacyPageBindings;
class AdvocacyLanding extends BaseClass {
    componentDidMount() {
        setPageLoadAnaytics(this.props.pageType);
    }

    renderJoinBI = ({ actionParams }) => {
        return (
            <Button
                variant='primary'
                data-at={Sephora.debug.dataAt('join_now_btn')}
                onClick={() =>
                    this.props.showBiRegisterModal({
                        ...actionParams,
                        callback: () => {
                            // Notify parent component of BI conversion success in order to show proper success
                            // barcode page for non bi users converting to BI user
                            this.props.onBiConversionSuccess();
                        }
                    })
                }
                children={this.props.locales.joinNow}
            />
        );
    };

    renderRegister = ({ variant = 'primary', actionParams }) => {
        return (
            <Button
                variant={variant}
                data-at={Sephora.debug.dataAt('create_account_btn')}
                onClick={() => this.props.showRegisterModal(actionParams)}
                children={this.props.locales.createAccount}
            />
        );
    };

    renderSignIn = ({ actionParams }) => {
        return (
            <Button
                variant='primary'
                data-at={Sephora.debug.dataAt('sign_in_btn')}
                onClick={() =>
                    this.props.showSignInModal({
                        ...actionParams,
                        extraParams: { ...actionParams.extraParams, headerValue: HEADER_VALUE.USER_CLICK }
                    })
                }
                children={this.props.locales.signIn}
            />
        );
    };

    renderActionButtons = ({ referral, isBI, isFnF }) => {
        const actionParams = {
            isOpen: true,
            extraParams: { referral }
        };

        if (!userUtils.isAnonymous()) {
            if (!isBI) {
                return this.renderJoinBI({ actionParams });
            }
        } else if (isFnF) {
            return (
                <Grid columns={[0, 2]}>
                    {this.renderSignIn({
                        block: true,
                        actionParams
                    })}
                    {this.renderRegister({
                        variant: 'secondary',
                        block: true,
                        actionParams
                    })}
                </Grid>
            );
        }

        return null;
    };

    render() {
        const {
            seo,
            globalHeroBanner,
            globalInvitationText,
            referralOfferDescription,
            referralInstructions,
            referralDisclaimer,
            referrerFirstName,
            campaignType,
            isFnF,
            referral
        } = this.props;

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
                            <Text
                                is='p'
                                fontWeight='bold'
                                fontSize='2xl'
                                marginTop={5}
                                data-at={Sephora.debug.dataAt('offer_description')}
                                children={referralOfferDescription}
                            />
                        </Box>
                        <Box
                            borderLeft={[0, '1px solid lightGray']}
                            marginTop={[5, 0]}
                        >
                            <Box marginLeft={[0, 7]}>
                                {referralInstructions && (
                                    <Copy
                                        content={referralInstructions}
                                        marginTop={0}
                                        data-at={Sephora.debug.dataAt('instructions')}
                                        marginBottom={5}
                                    />
                                )}
                                {this.renderActionButtons({
                                    campaignType,
                                    isBI: userUtils.isBI(),
                                    isLoggedIn: userUtils.isSignedIn(),
                                    referral,
                                    isFnF
                                })}
                            </Box>
                        </Box>
                    </Grid>
                    {referralDisclaimer && (
                        <>
                            <Divider
                                marginTop={[6, 7]}
                                marginBottom={[5, 4]}
                            />
                            <Copy
                                content={referralDisclaimer}
                                data-at={Sephora.debug.dataAt('offer_disclaimer')}
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

export default wrapComponent(AdvocacyLanding, 'AdvocacyLanding', true);
