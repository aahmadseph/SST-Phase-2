import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Box, Button, Divider, Image, Text, Link
} from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import IconCameraOutline from 'components/LegacyIcon/IconCameraOutline';
import IconPlay from 'components/LegacyIcon/IconPlay';
import SectionContainer from 'components/RichProfile/UserProfile/common/SectionContainer/SectionContainer';
import PixleeUploader from 'components/Community/PixleeUploader';
import pixleeUtils from 'utils/pixlee';
import communityUtils from 'utils/Community';
import localeUtils from 'utils/LanguageLocale';
import urlUtils from 'utils/Url';

const { getLink } = urlUtils;
const { getLocaleResourceFile } = localeUtils;
const { checkUserBeforeActions } = pixleeUtils;

const COMMUNITY_URLS = communityUtils.COMMUNITY_URLS;
const BEAUTY_BOARD_URL = COMMUNITY_URLS.GALLERY;

class Looks extends BaseClass {
    state = {
        openPixleeUploader: false
    };

    togglePixleeUploader = (closeUploader = false) => {
        if (!closeUploader) {
            checkUserBeforeActions().then(() => {
                this.setState({
                    openPixleeUploader: true
                });
            });
        } else {
            this.setState({
                openPixleeUploader: false
            });
        }
    };

    render() {
        const getText = getLocaleResourceFile('components/RichProfile/UserProfile/common/locales', 'Looks');
        const isMobile = Sephora.isMobile();
        const { isFeaturedLooks = false, isPublic, nickname, media = [] } = this.props;

        const title = getText(isFeaturedLooks ? 'featuredPhotos' : isPublic ? 'photos' : 'myPhotos');

        const linkforViewAll = getLink(isPublic ? `/community/gallery/users/${nickname}` : '/community/gallery/mygallery');

        return (
            <SectionContainer
                hasDivider={true}
                title={title}
                link={linkforViewAll}
                intro={isFeaturedLooks && getText('isFeaturedPhotos')}
            >
                {isPublic && !media.length ? (
                    <Box
                        fontSize={isMobile ? 'base' : 'md'}
                        textAlign={isMobile ? 'left' : 'center'}
                    >
                        <Text
                            is='p'
                            color='gray'
                            marginBottom='1em'
                        >
                            {getText('hasntAddedPhotosVideos', [nickname])}
                        </Text>
                        <Link
                            padding={3}
                            margin={-3}
                            arrowDirection='right'
                            href={BEAUTY_BOARD_URL}
                        >
                            {getText('exploreAllPhotos')}
                        </Link>
                    </Box>
                ) : (
                    <React.Fragment>
                        <LegacyGrid gutter={isMobile ? 4 : 5}>
                            {media.map((medium, index) => (
                                <LegacyGrid.Cell
                                    key={medium.id || index.toString()}
                                    width={isMobile ? '50%' : '25%'}
                                >
                                    <Box
                                        href={`/community/gallery?photoId=${medium.album_photo_id}`}
                                        display='block'
                                        position='relative'
                                        paddingBottom='100%'
                                        css={{
                                            transition: 'opacity .2s',
                                            '.no-touch &:hover': {
                                                opacity: 0.5
                                            }
                                        }}
                                    >
                                        <Image
                                            display='block'
                                            size='100%'
                                            src={
                                                medium.contentType?.toLowerCase() === 'video'
                                                    ? medium.thumbnail_url
                                                    : medium.pixlee_cdn_photos.original_url
                                            }
                                            alt={getText('userGeneratedImage')}
                                            css={{
                                                position: 'absolute',
                                                objectFit: 'cover'
                                            }}
                                        />
                                        {medium.contentType?.toLowerCase() === 'video' && (
                                            <IconPlay
                                                color='white'
                                                width='30%'
                                                height='30%'
                                                position='absolute'
                                                top='35%'
                                                left='35%'
                                            />
                                        )}
                                    </Box>
                                </LegacyGrid.Cell>
                            ))}
                        </LegacyGrid>
                        {isMobile && <Divider marginY={4} />}
                        <Box
                            textAlign='center'
                            marginTop={isMobile || 6}
                        >
                            <Button
                                variant='primary'
                                minWidth={isMobile || '20em'}
                                block={isMobile}
                                onClick={() => {
                                    this.togglePixleeUploader();
                                }}
                            >
                                <IconCameraOutline
                                    fontSize='1.375em'
                                    marginRight='.75em'
                                />
                                {getText('uploadToGallery')}
                            </Button>
                        </Box>
                        {this.state.openPixleeUploader && <PixleeUploader closeUploader={() => this.togglePixleeUploader(true)} />}
                    </React.Fragment>
                )}
            </SectionContainer>
        );
    }
}

export default wrapComponent(Looks, 'Looks');
