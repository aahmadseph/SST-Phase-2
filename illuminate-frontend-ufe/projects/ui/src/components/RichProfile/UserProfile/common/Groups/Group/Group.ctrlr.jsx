import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { space } from 'style/config';
import {
    Box, Flex, Image, Text, Divider, Button
} from 'components/ui';
import Embed from 'components/Embed/Embed';
import Ellipsis from 'components/Ellipsis/Ellipsis';
import communityUtils from 'utils/Community';
import localeUtils from 'utils/LanguageLocale';
import lithiumApi from 'services/api/thirdparty/Lithium';

const { getCommunityUrl, ensureUserIsReadyForSocialAction, PROVIDER_TYPES } = communityUtils;

class Group extends BaseClass {
    state = { isGroupMember: null };

    joinGroupHandler = () => {
        const isGroupMember = this.state.isGroupMember !== null ? this.state.isGroupMember : this.props.isGroupMember;

        this.joinOrLeaveGroup(this.props.group.id, isGroupMember);
    };

    joinOrLeaveGroup = (groupId, isGroupMember) => {
        const groupAction = isGroupMember ? 'remove' : 'add';
        const previousFollowersCount = this.state.groupFollowers ? this.state.groupFollowers : this.props.group.followers;
        lithiumApi.joinOrLeaveGroup(groupId, groupAction).then(() => {
            this.setState({
                isGroupMember: !isGroupMember,
                groupFollowers: isGroupMember ? previousFollowersCount - 1 : previousFollowersCount + 1
            });
        });
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/UserProfile/common/Groups/Group/locales', 'Group');
        const { group, isFeaturedGroups, isPublic } = this.props;

        const communityUrl = getCommunityUrl();

        const imageSource = communityUrl + group.image;
        const groupUrl = communityUrl + group.group_url;

        const isGroupMember = this.state.isGroupMember !== null ? this.state.isGroupMember : this.props.isGroupMember;

        const groupFollowers = this.state.groupFollowers ? this.state.groupFollowers : group.followers;

        const pad = Sephora.isMobile() ? space[3] : space[4];

        return (
            <Flex
                lineHeight='tight'
                flexDirection='column'
                width='100%'
                padding={pad}
                borderRadius={1}
                css={{
                    boxShadow: '0 0 5px 0 rgba(0,0,0,0.15)'
                }}
            >
                <Box href={groupUrl}>
                    <Box
                        marginBottom='1em'
                        marginX={['auto', 0]}
                        maxWidth={[140, 'none']}
                    >
                        <Embed>
                            <Image
                                src={imageSource}
                                borderRadius='full'
                                alt={group.name}
                            />
                        </Embed>
                    </Box>
                    <Text
                        is='h3'
                        fontSize={['md', 'lg']}
                        fontWeight='bold'
                        numberOfLines={1}
                        marginBottom='.25em'
                    >
                        {group.name}
                    </Text>
                    <Flex
                        lineHeight='none'
                        alignItems='center'
                        justifyContent='center'
                    >
                        <img
                            src='/img/ufe/icons/members.svg'
                            alt=''
                            css={{
                                width: '1.25em',
                                height: '1.25em'
                            }}
                        />
                        <Text
                            marginLeft='.25em'
                            marginRight='1em'
                        >
                            {groupFollowers}
                        </Text>
                        <img
                            src='/img/ufe/icons/chat.svg'
                            alt=''
                            css={{
                                width: '1.125em',
                                height: '1.125em'
                            }}
                        />
                        <Text marginLeft='.25em'>{getText('new', [group.recentconvs])}</Text>
                    </Flex>
                    {(isFeaturedGroups || isPublic) && (
                        <Divider
                            marginY={3}
                            marginX={-(pad / 2) + 'px'}
                        />
                    )}
                </Box>
                {(isFeaturedGroups || isPublic) && (
                    <Ellipsis
                        marginY='auto'
                        lineHeight='tight'
                        numberOfLines={3}
                        htmlContent={group.description}
                    />
                )}
                {(isFeaturedGroups || isPublic) && (
                    <Box paddingTop={3}>
                        <Button
                            variant='primary'
                            size={Sephora.isMobile() ? 'sm' : null}
                            onClick={() =>
                                ensureUserIsReadyForSocialAction(PROVIDER_TYPES.lithium).then(() => {
                                    this.joinGroupHandler();
                                })
                            }
                            block={true}
                        >
                            {getText(isGroupMember ? 'member' : 'join')}
                        </Button>
                    </Box>
                )}
            </Flex>
        );
    }
}

export default wrapComponent(Group, 'Group');
