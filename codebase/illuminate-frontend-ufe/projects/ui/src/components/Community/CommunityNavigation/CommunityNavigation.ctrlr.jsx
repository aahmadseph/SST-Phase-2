import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Flex, Button, Icon } from 'components/ui';
import Tooltip from 'components/Tooltip/Tooltip';
import pixleeUtils from 'utils/pixlee';
import communityUtils from 'utils/Community';
import Subnav from 'components/Subnav/Subnav';
import PixleeUploader from 'components/Community/PixleeUploader';

const { socialCheckLink, getCommunityUrl, COMMUNITY_URLS, PROVIDER_TYPES } = communityUtils;
const { checkUserBeforeActions } = pixleeUtils;

class CommunityNavigation extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            openPixleeUploader: false
        };
    }

    handleUploadToGallery = () => {
        checkUserBeforeActions().then(() => {
            this.setState({
                openPixleeUploader: true
            });
        });
    };

    removePixleeContainer = () => {
        this.setState({
            openPixleeUploader: false
        });
    };

    handleSocialCheckLink = url => () => {
        socialCheckLink(url, PROVIDER_TYPES.lithium);
    };

    render() {
        const {
            section,
            localization: {
                community,
                profile,
                groups,
                gallery,
                communityNavigation,
                notificationsFeed,
                startAConversation,
                messages,
                uploadToGallery
            } = {}
        } = this.props;

        const baseUrl = getCommunityUrl();

        const links = [
            {
                label: community,
                link: baseUrl
            },
            {
                label: profile,
                link: '/community/gallery/mygallery',
                isActive: section === 'profile'
            },
            {
                label: groups,
                link: baseUrl + COMMUNITY_URLS.GROUPS
            },
            {
                label: gallery,
                link: COMMUNITY_URLS.GALLERY,
                isActive: section === 'gallery'
            }
        ];

        return (
            <Subnav
                ariaLabel={communityNavigation}
                links={links}
            >
                <Flex
                    marginRight={-3}
                    alignItems={[null, 'center']}
                >
                    <Button
                        size='sm'
                        variant='secondary'
                        css={{ alignSelf: 'center' }}
                        children={startAConversation}
                        data-at={Sephora.debug.dataAt('start_conversation_btn')}
                        onClick={this.handleSocialCheckLink(baseUrl + COMMUNITY_URLS.FORUM)}
                    />
                    <Button
                        size='sm'
                        variant='secondary'
                        marginX={2}
                        css={{ alignSelf: 'center' }}
                        children={uploadToGallery}
                        data-at={Sephora.debug.dataAt('upload_to_gallery')}
                        onClick={this.handleUploadToGallery}
                    />
                    <Tooltip
                        content={notificationsFeed}
                        side='bottom'
                    >
                        <Flex
                            alignItems='center'
                            paddingX={3}
                            data-at={Sephora.debug.dataAt('notifications_btn')}
                            onClick={this.handleSocialCheckLink(baseUrl + COMMUNITY_URLS.NOTIFICATIONS)}
                        >
                            <Icon name='notifications' />
                        </Flex>
                    </Tooltip>
                    <Tooltip
                        content={messages}
                        side='bottom'
                    >
                        <Flex
                            alignItems='center'
                            paddingX={3}
                            data-at={Sephora.debug.dataAt('messages_btn')}
                        >
                            <Icon
                                name='messages'
                                onClick={this.handleSocialCheckLink(baseUrl + COMMUNITY_URLS.MESSAGES)}
                            />
                        </Flex>
                    </Tooltip>
                </Flex>
                {this.state.openPixleeUploader && <PixleeUploader closeUploader={this.removePixleeContainer} />}
            </Subnav>
        );
    }
}

export default wrapComponent(CommunityNavigation, 'CommunityNavigation', true);
