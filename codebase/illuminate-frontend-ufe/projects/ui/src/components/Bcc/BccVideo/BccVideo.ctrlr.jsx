import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import Embed from 'components/Embed/Embed';
import {
    Box, Grid, Link, Image, Flex
} from 'components/ui';
import BccBase from 'components/Bcc/BccBase/BccBase';
import Player from 'services/api/thirdparty/Player';
import Store from 'Store';
import Actions from 'Actions';
import AnalyticsConstants from 'analytics/constants';
import ProcessEvent from 'analytics/processEvent';
import ImageUtils from 'utils/Image';
import UrlUtils from 'utils/Url';
// I18n
import localeUtils from 'utils/LanguageLocale';
import { DebouncedScroll } from 'constants/events';
import Empty from 'constants/empty';

const { addInternalTracking } = UrlUtils;
const { getImageSrc } = ImageUtils;

const initialEvents = {
    PLAY: false,
    PERCENT_25: false,
    PERCENT_50: false,
    PERCENT_75: false,
    COMPLETE: false
};
const playerEvents = {};

class BccVideo extends BaseClass {
    state = {
        isOpen: false,
        thumbnail: null
    };

    componentDidMount() {
        const { videoId, overlayFlag, skuId } = this.props;

        if (!playerEvents[videoId]) {
            playerEvents[videoId] = { ...initialEvents };
        }

        Player.getByVideoId(videoId)
            .then(player => {
                if (player) {
                    if (!overlayFlag) {
                        this.subscribeOnTrackingEvents(player, skuId);
                    }

                    this.subscribeOnChangeFullScreenMode(player, this.restoreWindowScrollPosition);
                }
            })
            .catch(() => {});

        if (!Sephora.isNodeRender) {
            window.addEventListener(DebouncedScroll, () => {
                const { pageXOffset, pageYOffset } = window;

                if (pageYOffset) {
                    this.windowPosition = {
                        pageXOffset,
                        pageYOffset
                    };
                }
            });
        }
    }

    onVideoSelect = () => {
        Player.getByVideoId(this.props.videoId)
            .then(player => {
                if (player) {
                    player.ready(() => {
                        player.play();
                        this.isPlaying = true;
                    });
                    this.subscribeOnChangeFullScreenMode(player, this.restoreWindowScrollPosition);
                    this.subscribeOnTrackingEvents(player, this.props.skuId);
                }
            })
            .catch(() => {});
    };

    subscribeOnChangeFullScreenMode = (player, onFullScreenChange) => {
        if (!player || !onFullScreenChange || this.isSubscribedOnFullScreenChange) {
            return;
        }

        // In SPA world we have to unsubscribe too!
        player.on('fullscreenchange', () => {
            // player.isFullscreen() returns true instead of false
            // when we exit fullscreen mode using keyboard key "Esc"
            onFullScreenChange();
        });
        this.isSubscribedOnFullScreenChange = true;
    };

    restoreWindowScrollPosition = () => {
        if (this.windowPosition) {
            const { pageXOffset, pageYOffset } = this.windowPosition;

            if (pageYOffset) {
                window.scroll(pageXOffset, pageYOffset);
            }
        }
    };

    trackAnalytics = (videoName, eventStrings, actionInfo, productStrings) => {
        ProcessEvent.process(AnalyticsConstants.LINK_TRACKING_EVENT, {
            data: {
                videoName,
                eventStrings,
                ...(actionInfo ? { actionInfo } : Empty.Object),
                ...(productStrings ? { productStrings } : Empty.Object)
            }
        });
    };

    subscribeOnTrackingEvents = (player, skuId) => {
        const productStrings = skuId ? `;${skuId};;;;eVar26=${skuId}` : null;

        // In SPA world we have to unsubscribe too!
        player.on('timeupdate', () => {
            const videoName = player.mediainfo.name;
            const videoId = player.mediainfo.id;
            const duration = player.mediainfo.duration;
            const currentTime = player.currentTime();
            const progress = Math.round((currentTime * 100) / duration);
            const currentEvents = playerEvents[this.props.videoId];
            const eVar24 = `${videoName}:${videoId}:${duration}`;

            switch (progress) {
                case 25:
                case 26: {
                    if (!currentEvents.PERCENT_25) {
                        currentEvents.PERCENT_25 = true;
                        this.trackAnalytics(eVar24, [AnalyticsConstants.Event.EVENT_103], null, productStrings);
                    }

                    break;
                }
                case 50:
                case 51: {
                    if (!currentEvents.PERCENT_50) {
                        currentEvents.PERCENT_50 = true;
                        this.trackAnalytics(eVar24, [AnalyticsConstants.Event.EVENT_104], null, productStrings);
                    }

                    break;
                }
                case 75:
                case 76: {
                    if (!currentEvents.PERCENT_75) {
                        currentEvents.PERCENT_75 = true;
                        this.trackAnalytics(eVar24, [AnalyticsConstants.Event.EVENT_105], null, productStrings);
                    }

                    break;
                }
                case 99:
                case 100: {
                    if (!currentEvents.COMPLETE) {
                        currentEvents.COMPLETE = true;
                        this.trackAnalytics(eVar24, [AnalyticsConstants.Event.EVENT_106], null, productStrings);
                    }

                    break;
                }
                default: {
                    break;
                }
            }
        });

        player.on('play', () => {
            if (!playerEvents[this.props.videoId].PLAY) {
                const videoName = player.mediainfo.name;
                const videoId = player.mediainfo.id;
                const totalDuration = player.mediainfo.duration;

                const eVar24 = `${videoName}:${videoId}:${totalDuration}`;
                const eventStrings = [AnalyticsConstants.Event.EVENT_107, AnalyticsConstants.Event.EVENT_102];
                const actionInfo = `${Sephora.pagePath.split('/')[0].toLowerCase()}:video popup`;

                playerEvents[this.props.videoId].PLAY = true;
                this.trackAnalytics(eVar24, eventStrings, actionInfo, productStrings);
            }
        });
    };

    pause = () => {
        if (this.isPlaying) {
            Player.getByVideoId(this.props.videoId)
                .then(player => {
                    if (player) {
                        player.pause();
                        this.isPlaying = false;
                    }
                })
                .catch(() => {});
        }
    };

    openVideoModal = () => {
        Store.dispatch(
            Actions.showVideoModal({
                isOpen: true,
                videoTitle: this.props.videoTitle,
                videoModalUpdated: this.onVideoSelect.bind(this),
                video: this.video
            })
        );
    };

    getVideoDescription = targetUrlWithTracking => {
        const getText = localeUtils.getLocaleResourceFile('components/Bcc/BccVideo/locales', 'BccVideo');

        const { videoTitle, videoSubHead, targetUrl, hideDescription } = this.props;

        return (
            !hideDescription &&
            (videoTitle || videoSubHead || targetUrl) && (
                <Grid
                    alignItems='center'
                    lineHeight='tight'
                    gap={4}
                    marginTop={3}
                    columns={targetUrlWithTracking && '1fr auto'}
                >
                    <div>
                        {videoTitle && <strong>{videoTitle}</strong>}
                        {videoTitle && <br />}
                        {videoSubHead && videoSubHead}
                    </div>
                    {targetUrlWithTracking && (
                        <Link
                            href={targetUrlWithTracking}
                            arrowDirection='right'
                            padding={2}
                            margin={-2}
                        >
                            {getText('shopNow')}
                        </Link>
                    )}
                </Grid>
            )
        );
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/Bcc/BccVideo/locales', 'BccVideo');

        const {
            name,
            overlayFlag,
            videoId,
            isButton = true,
            startImagePath,
            thumbnailWidth = '100%',
            thumbnailHeight,
            thumbnailRatio,
            videoTitle,
            targetUrl,
            ratio = 9 / 16,
            width,
            height,
            isContained,
            enablePageRenderTracking = null,
            isSmallThumb,
            disableLazyLoad
        } = this.props;

        const imageSrc = startImagePath || this.state.thumbnail || null;

        /**
         * Video fragment is implemented according to this documentation:
         * https://support.brightcove.com/choosing-correct-embed-code
         */
        const video = (
            <Embed
                ratio={height / width || ratio}
                style={{ zIndex: 0 }}
            >
                <video-js
                    id={videoId}
                    data-account={Player.ACCOUNT_ID}
                    data-player={Player.PLAYER_ID}
                    data-embed='default'
                    controls
                    data-video-id={Player.getPlayerVideoId(videoId)}
                    data-playlist-id=''
                    data-application-id=''
                    width={width}
                    height={height}
                ></video-js>
            </Embed>
        );

        this.video = video;

        const targetUrlWithTracking = addInternalTracking(targetUrl, [name, 'shop-now']);

        const thumbRatio = thumbnailRatio || thumbnailHeight / thumbnailWidth;
        const thumbDisplayWidth = isNaN(thumbnailWidth) ? width : thumbnailWidth;

        return (
            <BccBase {...this.props}>
                {overlayFlag ? (
                    <Box textAlign='center'>
                        <Box
                            onClick={isButton ? this.openVideoModal : null}
                            marginX='auto'
                            maxWidth='100%'
                            width={thumbnailWidth}
                        >
                            <Box
                                position='relative'
                                paddingBottom={`${thumbRatio * 100}%`}
                            >
                                <Image
                                    src={getImageSrc(imageSrc, thumbDisplayWidth)}
                                    srcSet={getImageSrc(imageSrc, thumbDisplayWidth, true)}
                                    alt={videoTitle || getText('video')}
                                    disableLazyLoad={enablePageRenderTracking || disableLazyLoad}
                                    isPageRenderImg={enablePageRenderTracking}
                                    size='100%'
                                    maxWidth={null}
                                    css={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        objectFit: 'cover'
                                    }}
                                />
                                <Flex
                                    justifyContent='center'
                                    alignItems='center'
                                    position='absolute'
                                    inset={0}
                                    backgroundColor='rgba(0,0,0,.25)'
                                >
                                    {isSmallThumb ? (
                                        <Image
                                            src='/img/ufe/icons/play-sm.svg'
                                            width={11}
                                            height={12}
                                            disableLazyLoad={true}
                                        />
                                    ) : (
                                        <Image
                                            src='/img/ufe/icons/play.svg'
                                            width='22%'
                                            disableLazyLoad={true}
                                        />
                                    )}
                                </Flex>
                            </Box>
                        </Box>
                        {this.getVideoDescription(targetUrlWithTracking)}
                    </Box>
                ) : (
                    <Box
                        marginX='auto'
                        maxWidth='100%'
                        width={width}
                    >
                        <Box marginX={Sephora.isMobile() && isContained ? '-container' : null}>
                            <div ref={videoWrapper => (this.videoWrapper = videoWrapper)}>{video}</div>
                        </Box>
                        {this.getVideoDescription(targetUrlWithTracking)}
                    </Box>
                )}
            </BccBase>
        );
    }
}

BccVideo.propTypes = {
    videoId: PropTypes.string.isRequired,
    skuId: PropTypes.string
};

export default wrapComponent(BccVideo, 'BccVideo', true);
