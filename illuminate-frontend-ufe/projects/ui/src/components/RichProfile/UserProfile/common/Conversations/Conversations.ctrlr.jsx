/* eslint-disable max-len */

import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { space } from 'style/config';
import {
    Box, Flex, Image, Text, Button, Divider, Link
} from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import Ellipsis from 'components/Ellipsis/Ellipsis';
import IconWrite from 'components/LegacyIcon/IconWrite';
import dateUtils from 'utils/Date';
import SectionContainer from 'components/RichProfile/UserProfile/common/SectionContainer/SectionContainer';
import communityUtils from 'utils/Community';
import localeUtils from 'utils/LanguageLocale';

const { socialCheckLink, getCommunityUrl, PROVIDER_TYPES, COMMUNITY_URLS } = communityUtils;
const { getLocaleResourceFile } = localeUtils;

class Conversations extends BaseClass {
    render() {
        const isMobile = Sephora.isMobile();
        const isDesktop = Sephora.isDesktop();
        const getText = getLocaleResourceFile('components/RichProfile/UserProfile/common/Conversations/locales', 'Conversations');

        const {
            conversations, isFeatured, socialId, nickname, isMyProfile
        } = this.props;

        const communityUrl = getCommunityUrl();

        const viewAllUrl =
            isFeatured || !conversations.length ? communityUrl : `${communityUrl}${COMMUNITY_URLS.CONVERSATIONS}${socialId}?isMyPost=true`;

        return (
            <SectionContainer
                hasDivider={true}
                title={getText(isMyProfile ? (isFeatured ? 'featuredPosts' : 'myPosts') : 'posts')}
                link={!isMyProfile && !conversations.length ? null : viewAllUrl}
                intro={isFeatured && getText('intro')}
            >
                {!isMyProfile && !conversations.length ? (
                    <Box
                        fontSize={isMobile ? 'base' : 'md'}
                        textAlign={isMobile ? 'left' : 'center'}
                    >
                        <Text
                            is='p'
                            color='gray'
                            marginBottom='1em'
                        >
                            {getText('hasntPostedAnyConversationsYet', [nickname])}
                        </Text>
                        <Link
                            padding={3}
                            margin={-3}
                            arrowDirection='right'
                            href={communityUrl}
                        >
                            {getText('exploreAllConversations')}
                        </Link>
                    </Box>
                ) : (
                    <div>
                        <LegacyGrid gutter={isDesktop ? 5 : null}>
                            {conversations.map((conversation, index) => {
                                const isReply = conversation.topic && conversation.id !== conversation.topic.id;
                                const body = (
                                    <div>
                                        <Ellipsis
                                            overflowText={getText('readMore')}
                                            lineHeight='tight'
                                            isLink={true}
                                            numberOfLines={conversation.images.length !== 0 && isMobile ? 2 : 4}
                                        >
                                            {conversation.body}
                                        </Ellipsis>
                                        {conversation.images.length !== 0 && (
                                            <Box
                                                marginTop={4}
                                                overflow='hidden'
                                                css={{
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {conversation.images.slice(0, 2).map(image => (
                                                    <Image
                                                        key={image.thumbnail.url}
                                                        src={image.thumbnail.url}
                                                        alt={getText('userGeneratedImage')}
                                                        height={110}
                                                        marginRight={4}
                                                    />
                                                ))}
                                            </Box>
                                        )}
                                    </div>
                                );

                                return (
                                    <LegacyGrid.Cell
                                        key={isReply ? conversation.id : conversation.topic ? conversation.topic.id : index}
                                        width={isDesktop ? '50%' : null}
                                    >
                                        <Box
                                            href={communityUrl + (conversation.topic ? conversation.topic.topic_url : conversation.topic_url)}
                                            lineHeight='tight'
                                            css={
                                                isDesktop
                                                    ? {
                                                        boxShadow: '0 0 5px 0 rgba(0,0,0,0.15)',
                                                        padding: space[4]
                                                    }
                                                    : {}
                                            }
                                        >
                                            <Flex
                                                fontSize='sm'
                                                justifyContent='space-between'
                                                marginBottom={1}
                                            >
                                                <Text>
                                                    {getText(isReply ? 'replyIn' : 'postIn')}
                                                    <b>{conversation.board.title}</b>
                                                </Text>
                                                <Text color='gray'>{dateUtils.formatSocialDate(conversation.post_time)}</Text>
                                            </Flex>
                                            <Text
                                                is='h3'
                                                fontSize={isMobile ? 'md' : 'xl'}
                                                fontWeight='bold'
                                                marginBottom='.25em'
                                            >
                                                {isReply ? conversation.topic.subject : conversation.subject}
                                            </Text>
                                            {isReply ? (
                                                <div>
                                                    <Text
                                                        is='p'
                                                        numberOfLines={1}
                                                        color='gray'
                                                    >
                                                        {conversation.topic.body}
                                                    </Text>
                                                    <Box
                                                        border={1}
                                                        borderColor='lightGray'
                                                        marginTop={4}
                                                        padding={4}
                                                    >
                                                        {body}
                                                    </Box>
                                                </div>
                                            ) : (
                                                body
                                            )}
                                        </Box>
                                    </LegacyGrid.Cell>
                                );
                            })}
                        </LegacyGrid>
                        {isMobile && <Divider marginY={4} />}
                        <Box
                            textAlign='center'
                            marginTop={isDesktop ? 6 : null}
                        >
                            <Button
                                variant='primary'
                                minWidth={isDesktop && '20em'}
                                block={!isDesktop}
                                onClick={() => socialCheckLink(communityUrl, PROVIDER_TYPES.bv)}
                            >
                                <IconWrite
                                    fontSize='1.375em'
                                    marginRight='.75em'
                                />
                                {getText('startSConversation')}
                            </Button>
                        </Box>
                    </div>
                )}
            </SectionContainer>
        );
    }
}

export default wrapComponent(Conversations, 'Conversations');
