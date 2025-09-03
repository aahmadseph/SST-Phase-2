/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import store from 'store/Store';
import actions from 'Actions';
import { colors, space } from 'style/config';
import {
    Box, Flex, Grid, Icon, Link, Text, Button, Divider, Image
} from 'components/ui';
import Avatar from 'components/Avatar';
import Action from 'components/Content/Action';

/* utils */
import userUtils from 'utils/User';
import localeUtils from 'utils/LanguageLocale';
import auth from 'utils/Authentication';
import anaUtils from 'analytics/utils';
import { HEADER_VALUE } from 'constants/authentication';

import communityUtils from 'utils/Community';

const {
    getCommunityUrl, socialCheckLink, COMMUNITY_URLS, COMMUNITY_BADGES, PROVIDER_TYPES
} = communityUtils;

const ActionFlex = Action(Flex);
const ActionLink = Action(Link);

const PROFILE_URL = '/profile/me';
const ICON_SIZE = 52;

const getText = text => localeUtils.getLocaleResourceFile('components/Header/CommunityContent/locales', 'CommunityContent')(text);

const signIn = () => {
    auth.requireAuthentication(false, null, null, null, false, HEADER_VALUE.USER_CLICK).catch(() => {});
};

const register = () => {
    store.dispatch(actions.showRegisterModal({ isOpen: true }));
};

const joinNow = () => {
    socialCheckLink(PROFILE_URL, PROVIDER_TYPES.lithium);
};
class CommunityContent extends BaseClass {
    state = {
        user: {},
        socialProfile: null,
        isAnonymous: null,
        isSocial: null
    };

    handleSocialCheckLink = (url, providerType) => () => {
        socialCheckLink(url, providerType);
    };

    handleOnClick = dismiss => () => {
        dismiss && dismiss();
    };

    render() {
        const { isAnonymous, isSocial, user, socialProfile } = this.state;
        const { firstLevel } = this.props;

        const communityUrl = getCommunityUrl();

        return (
            <Box lineHeight='tight'>
                <Box
                    paddingX={4}
                    marginBottom={3}
                >
                    <Grid
                        gap={5}
                        marginBottom={3}
                        alignItems='center'
                        columns='1fr auto auto'
                    >
                        <Link
                            {...(isAnonymous
                                ? {
                                    onClick: signIn
                                }
                                : isSocial
                                    ? {
                                        href: PROFILE_URL
                                    }
                                    : {
                                        onClick: joinNow
                                    })}
                            hoverSelector='.Link-target'
                            display='flex'
                            alignItems='center'
                        >
                            <Avatar
                                marginRight={3}
                                size={ICON_SIZE}
                            />
                            <div>
                                <div>
                                    <Text
                                        marginRight={1}
                                        fontWeight='bold'
                                        data-at={Sephora.debug.dataAt('nickname')}
                                        children={isSocial ? user.nickName : getText('communityProfile')}
                                    />
                                    {socialProfile && (
                                        <img
                                            src={communityUrl + socialProfile.engagementBadgeUrl}
                                            alt={COMMUNITY_BADGES[socialProfile.engagementBadgeUrl.split('.')[0]]}
                                            css={{ verticalAlign: 'middle' }}
                                            data-at={Sephora.debug.dataAt('rank')}
                                            height={14}
                                        />
                                    )}
                                </div>
                                <Text
                                    className='Link-target'
                                    color='gray'
                                    data-at={Sephora.debug.dataAt('info_msg')}
                                    fontSize='sm'
                                >
                                    {isAnonymous ? getText('signInPrompt') : !isSocial ? getText('joinPrompt') : getText('yourProfile')}
                                </Text>
                            </div>
                        </Link>
                        <Flex
                            onClick={this.handleSocialCheckLink(communityUrl + COMMUNITY_URLS.NOTIFICATIONS, PROVIDER_TYPES.lithium)}
                            aria-label={getText('notifications')}
                            data-at={Sephora.debug.dataAt('notifications_btn')}
                            title={getText('notifications')}
                            alignItems='center'
                            padding={3}
                            margin={-3}
                            fontSize='sm'
                        >
                            <Icon name='notifications' />
                        </Flex>
                        <Flex
                            onClick={this.handleSocialCheckLink(communityUrl + COMMUNITY_URLS.MESSAGES, PROVIDER_TYPES.lithium)}
                            aria-label={getText('messages')}
                            data-at={Sephora.debug.dataAt('messages_btn')}
                            title={getText('messages')}
                            alignItems='center'
                            padding={3}
                            margin={-3}
                            fontSize='sm'
                        >
                            <Icon name='messages' />
                        </Flex>
                    </Grid>
                    {isAnonymous && (
                        <Grid
                            gap={3}
                            columns={2}
                        >
                            <Button
                                onClick={signIn}
                                variant='primary'
                                size='sm'
                                children={getText('signIn')}
                            />
                            <Button
                                onClick={register}
                                variant='secondary'
                                size='sm'
                                children={getText('createAccount')}
                            />
                        </Grid>
                    )}
                    {!isAnonymous && !isSocial && (
                        <Button
                            data-at={Sephora.debug.dataAt('community_join_now_btn')}
                            variant='primary'
                            size='sm'
                            block={true}
                            onClick={joinNow}
                            children={getText('joinNow')}
                        />
                    )}
                </Box>
                {this.props.items &&
                    this.props.items.map((item, index) => {
                        return (
                            <React.Fragment key={index.toString()}>
                                <Divider />
                                {item.items ? (
                                    <React.Fragment>
                                        <Text
                                            key={`group_${index}`}
                                            is='h3'
                                            fontWeight='bold'
                                            paddingTop={4}
                                            paddingBottom={2}
                                            paddingX={4}
                                            css={{
                                                ':first-child': {
                                                    marginTop: -1,
                                                    borderTop: `8px solid ${colors.nearWhite}`
                                                }
                                            }}
                                            children={item.label}
                                        />

                                        <ul
                                            css={{
                                                ':not(:last-child)': {
                                                    marginBottom: space[2]
                                                }
                                            }}
                                        >
                                            {item.items.map((childItem, childIndex) => (
                                                <li key={`communityNavItemChildLink_${childIndex}`}>
                                                    <ActionLink
                                                        key={`communityNavChildItem_${childIndex}`}
                                                        sid={childItem.action?.sid}
                                                        action={childItem.action}
                                                        paddingX={4}
                                                        paddingY={2}
                                                        analyticsNextPageData={{
                                                            navigationInfo: anaUtils.buildNavPath([
                                                                firstLevel,
                                                                'community',
                                                                item.label,
                                                                childItem.label
                                                            ])
                                                        }}
                                                    >
                                                        {childItem.label}
                                                    </ActionLink>
                                                </li>
                                            ))}
                                        </ul>
                                    </React.Fragment>
                                ) : (
                                    <ActionFlex
                                        key={`communityNavItem_${index}`}
                                        sid={item.action?.sid}
                                        onClick={this.handleOnClick(this.props.onDismiss)}
                                        action={item.action}
                                        paddingY={3}
                                        paddingX={4}
                                        analyticsNextPageData={{ navigationInfo: anaUtils.buildNavPath([firstLevel, 'community', item.label]) }}
                                    >
                                        {item.media?.src && (
                                            <Image
                                                src={item.media.src}
                                                size={ICON_SIZE}
                                                marginRight={3}
                                            />
                                        )}
                                        {item.label && (
                                            <Box flex={1}>
                                                <span
                                                    className='Link-target'
                                                    children={item.label}
                                                />
                                                {item.description && (
                                                    <Text
                                                        display='block'
                                                        marginTop='.25em'
                                                        color='gray'
                                                        fontSize='sm'
                                                        children={item.description}
                                                    />
                                                )}
                                            </Box>
                                        )}
                                    </ActionFlex>
                                )}
                            </React.Fragment>
                        );
                    })}
            </Box>
        );
    }

    componentDidMount() {
        store.setAndWatch(
            ['user', 'socialInfo.socialProfile'],
            this,
            () => {
                this.setState({
                    isAnonymous: userUtils.isAnonymous(),
                    isSocial: userUtils.isSocial()
                });
            },
            true
        );
    }
}

export default wrapComponent(CommunityContent, 'CommunityContent', true);
