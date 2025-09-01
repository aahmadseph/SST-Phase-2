import BaseClass from 'components/BaseClass';
import BeautyInsiderModuleLayout from 'components/Content/BeautyInsider/BeautyInsiderModuleLayout/BeautyInsiderModuleLayout';
import Flag from 'components/Flag/Flag';
import TextInput from 'components/Inputs/TextInput/TextInput';
import EmailShare from 'components/SocialShares/EmailShare/EmailShare';
import TwitterShare from 'components/SocialShares/TwitterShare/TwitterShare';
import {
    Box, Button, Divider, Grid, Link, Text
} from 'components/ui';
import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import Copy from 'components/Content/Copy';
import dateUtils from 'utils/Date';
import localeUtils from 'utils/LanguageLocale';
import { wrapComponent } from 'utils/framework';
// import FacebookShare from 'components/SocialShares/FacebookShare/FacebookShare';
import beautyInsiderPageBindings from 'analytics/bindingMethods/pages/beautyInsider/beautyInsiderPageBindings';
import analyticsConstants from 'analytics/constants';
const {
    ACTION_INFO: { BI_REFER_AND_EARN_COPY }
} = analyticsConstants;

const getText = localeUtils.getLocaleResourceFile('components/Content/BeautyInsider/BeautyInsiderModules/ActiveCampaign/locales', 'ActiveCampaign');

const COPIED_TEXT_TIMEOUT = 2000;

class ActiveCampaign extends BaseClass {
    state = {
        isCopied: false
    };

    copyTimeout;

    onCopy = () => {
        beautyInsiderPageBindings.fireLinkTracking(BI_REFER_AND_EARN_COPY);
        this.setState({ isCopied: true }, () => {
            this.copyTimeout = setTimeout(() => this.setState({ isCopied: false }), COPIED_TEXT_TIMEOUT);
        });
    };

    componentWillUnmount() {
        clearTimeout(this.copyTimeout);
    }

    leftContentZone = () => {
        const { promoHeadLine, campaignEndDate, howToQualify1, seeMoreMediaId } = this.props.content;

        return (
            <Box>
                <Text
                    is='p'
                    fontWeight='bold'
                    fontSize='md'
                    children={promoHeadLine}
                    marginBottom={3}
                />
                <Flag children={getText('ends', [dateUtils.getDateInWeekdayMonthDayFormat(campaignEndDate)])} />
                <Text
                    is='p'
                    marginTop={3}
                    css={{ whiteSpace: 'pre-wrap' }}
                    children={howToQualify1}
                />
                {seeMoreMediaId && (
                    <Link
                        display='block'
                        color='blue'
                        marginTop={2}
                        data-at={Sephora.debug.dataAt('active_campaign_see_more_link')}
                        onClick={e => {
                            e.preventDefault();
                            this.props.openModal(seeMoreMediaId);
                        }}
                        children={getText('seeMore')}
                    />
                )}
            </Box>
        );
    };

    rightContentZone = () => {
        const {
            howToQualify2, referralLink, socialMedia1, socialMedia2, infoSectionTitle, infoSectionText
        } = this.props.content;
        const { isCopied } = this.state;

        return (
            <Box marginTop={[4, 0]}>
                <Text
                    is='p'
                    marginBottom={3}
                    children={howToQualify2}
                />
                <Grid
                    columns={[1, '1fr auto']}
                    gap={2}
                    marginY={3}
                >
                    <TextInput
                        readOnly={true}
                        marginBottom={null}
                        value={referralLink}
                    />
                    <CopyToClipboard
                        text={referralLink}
                        onCopy={this.onCopy}
                    >
                        <Button
                            className={isCopied ? 'is-active' : null}
                            minWidth='6em'
                            width={['50%', 'auto']}
                            variant={isCopied ? 'secondary' : 'primary'}
                        >
                            {isCopied ? getText('copied') : getText('copy')}
                        </Button>
                    </CopyToClipboard>
                </Grid>
                <Grid
                    columns='auto auto auto 1fr'
                    gap={4}
                >
                    <EmailShare
                        subject={socialMedia1}
                        body={socialMedia2 + ' ' + referralLink}
                    />
                    {/* LOYLS-474 temporarly hides FB icon untill FB App got restored */}
                    {/* <FacebookShare link={referralLink} /> */}
                    <TwitterShare
                        link={referralLink}
                        text={socialMedia1}
                    />
                </Grid>
                {infoSectionTitle && infoSectionText && (
                    <Box
                        backgroundColor='nearWhite'
                        height='fit-content'
                        marginTop={3}
                        borderRadius={2}
                    >
                        <Box padding={4}>
                            <Text
                                is='h4'
                                fontWeight='bold'
                                children={infoSectionTitle}
                            />
                            <Divider marginY={3} />
                            <Text
                                is='p'
                                children={infoSectionText}
                            />
                        </Box>
                    </Box>
                )}
            </Box>
        );
    };

    rwdRightContentZone = data => {
        if (!data?.content) {
            return null;
        }

        const { biProfileShareLinkInstructions, biProfileSocialMediaText1, biProfileSocialMediaText2 } = data?.content;

        const { referralLink } = this.props.content;
        const { isCopied } = this.state;

        return (
            <Box marginTop={[4, 0]}>
                <Text
                    is='p'
                    children={biProfileShareLinkInstructions}
                    marginBottom={3}
                />
                <Grid
                    columns={[1, '1fr auto']}
                    gap={2}
                    marginY={3}
                >
                    <TextInput
                        readOnly={true}
                        marginBottom={null}
                        value={referralLink}
                    />
                    <CopyToClipboard
                        text={referralLink}
                        onCopy={this.onCopy}
                    >
                        <Button
                            className={isCopied ? 'is-active' : null}
                            minWidth='6em'
                            width={['50%', 'auto']}
                            variant={isCopied ? 'secondary' : 'primary'}
                        >
                            {isCopied ? getText('copied') : getText('copy')}
                        </Button>
                    </CopyToClipboard>
                </Grid>
                <Grid
                    columns='auto auto auto 1fr'
                    gap={4}
                >
                    <EmailShare
                        subject={biProfileSocialMediaText1}
                        body={biProfileSocialMediaText2 + ' ' + referralLink}
                    />
                    {/* LOYLS-474 temporarly hides FB icon untill FB App got restored */}
                    {/* <FacebookShare link={referralLink} /> */}
                    <TwitterShare
                        link={referralLink}
                        text={biProfileSocialMediaText1}
                    />
                </Grid>
            </Box>
        );
    };

    rwdLeftContentZone = content => {
        if (!content) {
            return null;
        }

        const { biProfilePromoHeadline, biProfilePromoInstructions, successPromoEndDate } = content;

        return (
            <Box>
                <Text
                    is='h3'
                    fontWeight='bold'
                    fontSize='md'
                    children={biProfilePromoHeadline}
                    marginBottom={3}
                />
                {successPromoEndDate && <Flag children={getText('ends', [dateUtils.getDateInWeekdayMonthDayFormat(successPromoEndDate)])} />}
                {biProfilePromoInstructions && (
                    <Copy
                        content={biProfilePromoInstructions}
                        marginTop={3}
                        marginBottom={2}
                    />
                )}
            </Box>
        );
    };

    render() {
        const isAdvocacyContentfulEnabled = Sephora.configurationSettings.isAdvocacyContentfulEnabled;

        if (isAdvocacyContentfulEnabled && !this.props.content?.content) {
            return null;
        }

        const { campaignTitle, content: { biProfileCampaignTitle = '' } = {} } = this.props.content;

        return (
            <BeautyInsiderModuleLayout
                title={isAdvocacyContentfulEnabled ? biProfileCampaignTitle : campaignTitle}
                leftContentZone={isAdvocacyContentfulEnabled ? this.rwdLeftContentZone(this.props.content.content) : this.leftContentZone()}
                rightContentZone={isAdvocacyContentfulEnabled ? this.rwdRightContentZone(this.props.content) : this.rightContentZone()}
            />
        );
    }
}

export default wrapComponent(ActiveCampaign, 'ActiveCampaign');
