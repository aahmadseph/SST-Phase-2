/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import {
    Box, Image, Text, Grid, Button, Link, Divider
} from 'components/ui';
import BaseClass from 'components/BaseClass';
import localeUtils from 'utils/LanguageLocale';
import EmailShare from 'components/SocialShares/EmailShare/EmailShare';
import Flag from 'components/Flag/Flag';
import dateUtils from 'utils/Date';
import CopyToClipboard from 'react-copy-to-clipboard';
import Actions from 'Actions';
import store from 'store/Store';
// import FacebookShare from 'components/SocialShares/FacebookShare/FacebookShare';
import TwitterShare from 'components/SocialShares/TwitterShare/TwitterShare';
import TextInput from 'components/Inputs/TextInput/TextInput';
import Markdown from 'components/Markdown/Markdown';

const COPIED_TEXT_TIMEOUT = 2000;

class ActiveCampaign extends BaseClass {
    state = {
        isCopied: false
    };

    copyTimeout;

    onCopy = () => {
        this.setState({ isCopied: true }, () => {
            this.copyTimeout = setTimeout(() => this.setState({ isCopied: false }), COPIED_TEXT_TIMEOUT);
        });
    };

    showModal = mediaId => e => {
        e.preventDefault();
        store.dispatch(
            Actions.showMediaModal({
                isOpen: true,
                mediaId: mediaId
            })
        );
    };

    componentWillUnmount() {
        clearTimeout(this.copyTimeout);
    }

    render() {
        const { isCopied } = this.state;
        const { activeCampaign: campaign } = this.props;
        const {
            promoHeadLine,
            campaignEndDate,
            howToQualify1,
            howToQualify2,
            referralLink,
            campaignTitle,
            campaignImage,
            infoSectionTitle,
            infoSectionText,
            seeMoreMediaId
        } = campaign;
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/BeautyInsider/ActiveCampaign/locales', 'ActiveCampaign');

        const formattedDate = dateUtils.getDateInWeekdayMonthDayFormat(campaignEndDate);

        return (
            <>
                <Grid
                    columns={['auto 1fr', 1]}
                    gap={3}
                    alignItems='center'
                    lineHeight='tight'
                    marginBottom={[4, 6]}
                >
                    {!!campaignImage && (
                        <Image
                            display={['block', 'none']}
                            src={`/img/ufe/icons/${campaignImage}.svg`}
                            size={28}
                        />
                    )}
                    <Text
                        is='h2'
                        fontFamily='serif'
                        textAlign={[null, 'center']}
                        data-at={Sephora.debug.dataAt('active_campaign_title')}
                        fontSize={['xl', '2xl']}
                        children={campaignTitle}
                    />
                </Grid>
                <Grid
                    gap={[4, 9]}
                    maxWidth={813}
                    marginX='auto'
                    columns={[null, 2]}
                >
                    <div>
                        <Text
                            is='h3'
                            fontSize='md'
                            fontWeight='bold'
                            children={promoHeadLine}
                        />
                        <Flag
                            marginBottom={4}
                            children={getText('ends', [formattedDate])}
                        />
                        <Text
                            is='p'
                            css={{ whiteSpace: 'pre-wrap' }}
                            children={howToQualify1}
                        />
                        {seeMoreMediaId && (
                            <Link
                                display='block'
                                color='blue'
                                data-at={Sephora.debug.dataAt('active_campaign_see_more_link')}
                                padding={2}
                                margin={-2}
                                onClick={this.showModal(seeMoreMediaId)}
                                children={getText('seeMore')}
                            />
                        )}
                    </div>
                    <div>
                        <p>{howToQualify2}</p>
                        <Grid
                            columns='1fr auto'
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
                                subject={campaign.socialMedia1}
                                body={campaign.socialMedia2 + ' ' + campaign.referralLink}
                            />
                            {/* LOYLS-474 temporarly hides FB icon untill FB App got restored */}
                            {/* <FacebookShare link={campaign.referralLink} /> */}
                            <TwitterShare
                                link={campaign.referralLink}
                                text={campaign.socialMedia1}
                            />
                        </Grid>
                        {infoSectionTitle && infoSectionText && (
                            <Box
                                backgroundColor='nearWhite'
                                borderRadius={2}
                                lineHeight='tight'
                                paddingX={4}
                                paddingY={3}
                                marginTop={4}
                            >
                                <Text
                                    is='h3'
                                    fontWeight='bold'
                                    data-at={Sephora.debug.dataAt('active_campaign_label')}
                                    children={infoSectionTitle}
                                />
                                <Divider marginY={3} />
                                <span data-at={Sephora.debug.dataAt('active_campaign_message_label')}>
                                    <Markdown content={infoSectionText} />
                                </span>
                            </Box>
                        )}
                    </div>
                </Grid>
            </>
        );
    }
}

export default wrapComponent(ActiveCampaign, 'ActiveCampaign');
