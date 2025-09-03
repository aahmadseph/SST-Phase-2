/* eslint-disable max-len */

import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Box, Text, Link } from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import Group from 'components/RichProfile/UserProfile/common/Groups/Group/Group';
import SectionContainer from 'components/RichProfile/UserProfile/common/SectionContainer/SectionContainer';
import communityUtils from 'utils/Community';
import localeUtils from 'utils/LanguageLocale';

const { getCommunityUrl, COMMUNITY_URLS } = communityUtils;

class Groups extends BaseClass {
    render() {
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/UserProfile/common/Groups/locales', 'Groups');
        const { groups, isFeaturedGroups, isPublic, nickname } = this.props;

        const viewAllPath = () => {
            if (isFeaturedGroups || (isPublic && !groups.length)) {
                return '';
            } else if (isPublic) {
                return `?username=${nickname}`;
            } else {
                return '?pageType=my-group';
            }
        };
        const viewAllUrl = `${getCommunityUrl()}${COMMUNITY_URLS.GROUPS}${viewAllPath()}`;
        const groupHeader = getText(isFeaturedGroups ? 'featuredGroups' : isPublic ? 'groups' : 'myGroups');

        return (
            <SectionContainer
                title={groupHeader}
                link={isPublic && !groups.length ? null : viewAllUrl}
                intro={isFeaturedGroups && getText('joinGroupMessage')}
            >
                {isPublic && !groups.length ? (
                    <Box
                        fontSize={Sephora.isMobile() ? 'base' : 'md'}
                        textAlign={Sephora.isMobile() ? 'left' : 'center'}
                    >
                        <Text
                            is='p'
                            color='gray'
                            marginBottom='1em'
                        >
                            {getText('hasntJoinedAnyGroupsYet', [nickname])}
                        </Text>
                        <Link
                            padding={3}
                            margin={-3}
                            arrowDirection='right'
                            href={viewAllUrl}
                        >
                            {getText('exploreAllGroups')}
                        </Link>
                    </Box>
                ) : (
                    <LegacyGrid gutter={Sephora.isMobile() ? 3 : 4}>
                        {groups.map((group, index) => {
                            return (
                                <LegacyGrid.Cell
                                    key={index.toString()}
                                    textAlign='center'
                                    display='flex'
                                    fontSize={Sephora.isMobile() ? 'sm' : 'base'}
                                    width={Sephora.isMobile() ? 1 / 2 : 1 / 4}
                                >
                                    <Group
                                        group={group}
                                        isGroupMember={(isPublic && groups.length && group.user_context && group.user_context.isSubscribed) || null}
                                        isFeaturedGroups={isFeaturedGroups}
                                        isPublic={isPublic}
                                        nickname={nickname}
                                    />
                                </LegacyGrid.Cell>
                            );
                        })}
                    </LegacyGrid>
                )}
            </SectionContainer>
        );
    }
}

export default wrapComponent(Groups, 'Groups');
