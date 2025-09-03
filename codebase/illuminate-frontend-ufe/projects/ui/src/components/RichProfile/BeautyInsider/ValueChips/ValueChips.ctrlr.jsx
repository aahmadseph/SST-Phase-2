import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import store from 'store/Store';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import anaUtils from 'analytics/utils';
import Location from 'utils/Location';
import helpersUtils from 'utils/Helpers';
import * as ccConsts from 'constants/CreditCard';

import {
    Box, Flex, Image, Text, Button, Link
} from 'components/ui';
import { colors, space } from 'style/config';
import Popover from 'components/Popover/Popover';
import localeUtils from 'utils/LanguageLocale';
import UIUtils from 'utils/UI';

const getText = localeUtils.getLocaleResourceFile('components/RichProfile/BeautyInsider/ValueChips/locales', 'ValueChips');

const styles = {
    icon: {
        display: 'inline-flex',
        position: 'relative',
        padding: space[1],
        marginBottom: space[3]
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        flex: 1
    }
};

class ValueChips extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            profileId: this.props.profileId,
            hasSephoraCard: false,
            activePopover: null
        };
        this.communityPopover = React.createRef();
        this.appPopover = React.createRef();
        this.cardPopover = React.createRef();

        this.communityButton = React.createRef();
        this.appButton = React.createRef();
        this.cardButton = React.createRef();
    }

    componentDidMount() {
        store.setAndWatch(['beautyInsider.summary', 'user.beautyInsiderAccount'], this, data => {
            if (data.beautyInsiderAccount) {
                const ccStatus = data.beautyInsiderAccount.ccAccountandPrescreenInfo.ccApprovalStatus;
                const hasSephoraCard = ccStatus === ccConsts.APPROVAL_STATUS.APPROVED;
                this.setState({ hasSephoraCard: hasSephoraCard });
            }

            if (data.summary) {
                const newSummary = Object.assign({}, data.summary);
                this.setState(newSummary);
            }
        });
    }

    componentWillReceiveProps(updatedProps) {
        if (updatedProps.profileId && updatedProps.profileId !== this.state.profileId) {
            this.setState({ profileId: updatedProps.profileId });
        }
    }

    focusPopover = popoverName => {
        let current = null;

        switch (popoverName) {
            case 'community':
                current = this.communityPopover.current;

                break;
            case 'app':
                current = this.appPopover.current;

                break;
            case 'card':
                current = this.cardPopover.current;

                break;
            default:
                break;
        }

        helpersUtils.scrollTo(current, '.Popover', 150, 100);
    };

    openPopover = popoverName => () => {
        this.setState({ activePopover: popoverName }, () => {
            this.focusPopover(popoverName);
        });
    };

    handleChipClick = (title, href) => () => {
        const dataString = `${title}:subscribe now`;

        if (title === 'app') {
            processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    eventStrings: [anaConsts.Event.EVENT_71, anaConsts.Event.BI_CHIP_SUBSCRIBE],
                    linkName: dataString,
                    actionInfo: dataString,
                    biChipType: dataString
                }
            });
        } else {
            anaUtils.setNextPageData({
                events: [anaConsts.Event.EVENT_71, anaConsts.Event.BI_CHIP_SUBSCRIBE],
                linkData: dataString,
                biChipType: dataString
            });
        }

        Location.setLocation(href);
    };

    // eslint-disable-next-line complexity
    render() {
        const isDesktop = Sephora.isDesktop();
        const isMobile = Sephora.isMobile();

        const { activePopover, isCommunityMember, isMobileAppDownloaded, hasSephoraCard } = this.state;

        const downloadAppUrl = UIUtils.isIOS()
            ? 'https://itunes.apple.com/us/app/sephora-makeup-hair-beauty/id393328150'
            : 'https://play.google.com/store/apps/details?id=com.sephora';
        const { isGlobalEnabled, isMarketingEnabled } = Sephora.fantasticPlasticConfigurations;
        const shouldShowCCChip = isGlobalEnabled && isMarketingEnabled;

        const checkmark = (
            <Box
                position='absolute'
                top={0}
                right={0}
            >
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    width={22}
                    height={22}
                >
                    <path
                        fill={colors.red}
                        d='M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0z'
                    />
                    <path
                        fill='#fff'
                        d='M18.7 7.1v.3c0 .7-.3 1.4-.9 2l-.1.1-5.5 5.8c-1.2 1.2-2.2 2.2-3 2.8-.8.7-1.4 1-1.7 1-.4 0-.8-.2-1.3-.5s-.9-.7-1-1-.3-.9-.4-1.9-.2-2-.2-3.1c0-.6.3-1.2.8-1.7s1.1-.8 1.7-.8.9.5 1 1.6v.3c.1.8.2 1.4.3 1.7.2.3.4.5.6.5.1 0 .3-.1.5-.3s.5-.5.9-.8L16 7.5c.5-.5.9-.8 1.3-1.1.4-.2.7-.4.9-.4.2 0 .3.1.4.2.1.3.1.5.1.9z'
                    />
                </svg>
            </Box>
        );

        const communityIcon = (
            <div css={styles.icon}>
                <Image
                    display='block'
                    src='/img/ufe/chip-community.svg'
                    alt={getText('community')}
                    size={64}
                />
                {isCommunityMember && checkmark}
            </div>
        );

        const appIcon = (
            <div css={styles.icon}>
                <Image
                    display='block'
                    src='/img/ufe/chip-app.svg'
                    size={64}
                />
                {isMobileAppDownloaded && checkmark}
            </div>
        );

        const cardIcon = (
            <div css={styles.icon}>
                <Image
                    display='block'
                    src='/img/ufe/chip-card.svg'
                    size={64}
                />
                {hasSephoraCard && checkmark}
            </div>
        );

        const onItText = (
            <Text
                is='p'
                marginBottom={4}
            >
                {getText('youAreOnIt')}
                <br />
                {getText('takingAdvantageOfPerk')}
            </Text>
        );

        const communityContent = (
            <React.Fragment>
                {communityIcon}
                {isCommunityMember ? (
                    <React.Fragment>
                        {onItText}
                        <Button
                            variant='secondary'
                            block={true}
                            href='/profile/me'
                            children={getText('exploreNow')}
                        />
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Text
                            is='p'
                            marginBottom={4}
                            children={getText('getInspo')}
                        />
                        <Button
                            variant='secondary'
                            block={true}
                            onClick={this.handleChipClick('community', '/community')}
                            children={getText('joinCommunity')}
                        />
                    </React.Fragment>
                )}
            </React.Fragment>
        );

        const appContent = (
            <React.Fragment>
                {appIcon}
                {isMobileAppDownloaded ? (
                    <React.Fragment>
                        {onItText}
                        {isMobile && (
                            <Button
                                variant='secondary'
                                block={true}
                                href={'sephoraapp://home'}
                                children={getText('openApp')}
                            />
                        )}
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Text
                            is='p'
                            marginBottom={4}
                            children={getText('shopOnTheGo')}
                        />
                        {isMobile && (
                            <Button
                                variant='secondary'
                                block={true}
                                onClick={this.handleChipClick('app', downloadAppUrl)}
                                children={getText('openApp')}
                            />
                        )}
                    </React.Fragment>
                )}
            </React.Fragment>
        );

        const cardContent = (
            <React.Fragment>
                {cardIcon}
                <Text
                    is='p'
                    marginBottom={4}
                >
                    {hasSephoraCard ? getText('ccMember') : getText('getCC', [Sephora.configurationSettings.firstBuyIncentive])}
                </Text>
                <Button
                    variant='secondary'
                    block={true}
                    href={hasSephoraCard ? '/profile/CreditCard' : '/creditcard'}
                    children={getText(hasSephoraCard ? 'seeRewards' : 'applyNow')}
                />
            </React.Fragment>
        );

        const popoverProps = {
            placement: 'top',
            width: 351,
            padding: 5,
            showImmediately: true,
            isRelative: isDesktop,
            showX: true,
            onDismiss: () => this.setState({ activePopover: null }),
            textAlign: 'center'
        };

        return (
            <div>
                <Box
                    fontFamily='serif'
                    lineHeight='tight'
                    textAlign={isDesktop ? 'center' : null}
                    marginBottom={isDesktop ? 5 : 4}
                    fontSize={isDesktop ? '2xl' : 'xl'}
                    children={getText('title')}
                />
                <Flex
                    position='relative'
                    maxWidth={390}
                    marginX='auto'
                    lineHeight='tight'
                    textAlign='center'
                    alignItems='flex-start'
                >
                    <div css={styles.column}>
                        {activePopover === 'community' && (
                            <Popover
                                {...popoverProps}
                                dataAt={'join_community_pop_up'}
                                content={communityContent}
                                ref={this.communityPopover}
                            />
                        )}
                        <Link
                            onClick={this.openPopover('community')}
                            ref={this.communityButton}
                        >
                            {communityIcon}
                            <Text
                                fontSize='sm'
                                display='block'
                                children={getText('community')}
                            />
                        </Link>
                    </div>

                    <div css={styles.column}>
                        {activePopover === 'app' && (
                            <Popover
                                {...popoverProps}
                                dataAt={'app_pop_up'}
                                content={appContent}
                                ref={this.appPopover}
                            />
                        )}
                        <Link
                            onClick={this.openPopover('app')}
                            ref={this.appButton}
                        >
                            {appIcon}
                            <Text
                                fontSize='sm'
                                display='block'
                                children={getText('app')}
                            />
                        </Link>
                    </div>

                    {localeUtils.isUS() && shouldShowCCChip && (
                        <div css={styles.column}>
                            {activePopover === 'card' && (
                                <Popover
                                    {...popoverProps}
                                    dataAt={'sephora_cc_pop_up'}
                                    content={cardContent}
                                    ref={this.cardPopover}
                                />
                            )}
                            <Link
                                onClick={this.openPopover('card')}
                                ref={this.cardButton}
                            >
                                {cardIcon}
                                <Text
                                    fontSize='sm'
                                    display='block'
                                >
                                    {getText('sephoraCC')}
                                </Text>
                            </Link>
                        </div>
                    )}
                </Flex>
            </div>
        );
    }
}

export default wrapComponent(ValueChips, 'ValueChips');
