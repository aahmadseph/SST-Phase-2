import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import Embed from 'components/Embed/Embed';
import {
    Box, Grid, Link, Image, Flex, Container
} from 'components/ui';
import Player from 'services/api/thirdparty/Player';
import Store from 'Store';
import Actions from 'Actions';
import AnalyticsConstants from 'analytics/constants';
import ProcessEvent from 'analytics/processEvent';
import imageUtils from 'utils/Image';
import urlUtils from 'utils/Url';
// I18n
import localeUtils from 'utils/LanguageLocale';
import { mediaQueries } from 'style/config';
import { DebouncedScroll } from 'constants/events';

const { getImageSrc } = imageUtils;
const { addInternalTracking } = urlUtils;

const initialEvents = {
    PLAY: false,
    PERCENT_25: false,
    PERCENT_50: false,
    PERCENT_75: false,
    COMPLETE: false
};
const playerEvents = {};

class Video extends BaseClass {
    state = {
        isOpen: false,
        thumbnail: null
    };

    componentDidMount() {
        const { videoId, overlayFlag } = this.props;

        if (!playerEvents[videoId]) {
            playerEvents[videoId] = { ...initialEvents };
        }

        Player.getByVideoId(videoId)
            .then(player => {
                if (player) {
                    if (!overlayFlag) {
                        this.subscribeOnTrackingEvents(player, this.sendAnalyticsEvent);
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
                        if (!playerEvents[this.props.videoId].PLAY) {
                            playerEvents[this.props.videoId].PLAY = true;
                            this.sendAnalyticsEvent([
                                AnalyticsConstants.Event.EVENT_71,
                                AnalyticsConstants.Event.EVENT_102,
                                AnalyticsConstants.Event.EVENT_107
                            ]);
                        }

                        player.play();
                        this.isPlaying = true;
                    });
                    this.subscribeOnChangeFullScreenMode(player, this.restoreWindowScrollPosition);
                    this.subscribeOnTrackingEvents(player, this.sendAnalyticsEvent);
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

    subscribeOnTrackingEvents = (player, onTrackingEvent) => {
        // In SPA world we have to unsubscribe too!
        player.on('timeupdate', () => {
            const duration = player.mediainfo.duration;
            const currentTime = player.currentTime();
            const progress = Math.round((currentTime * 100) / duration);
            const currentEvents = playerEvents[this.props.videoId];

            switch (progress) {
                case 0:
                case 1: {
                    if (!currentEvents.PLAY) {
                        currentEvents.PLAY = true;
                        onTrackingEvent([AnalyticsConstants.Event.EVENT_71, AnalyticsConstants.Event.EVENT_102, AnalyticsConstants.Event.EVENT_107]);
                    }

                    break;
                }
                case 25:
                case 26: {
                    if (!currentEvents.PERCENT_25) {
                        currentEvents.PERCENT_25 = true;
                        onTrackingEvent([AnalyticsConstants.Event.EVENT_71, AnalyticsConstants.Event.EVENT_103]);
                    }

                    break;
                }
                case 50:
                case 51: {
                    if (!currentEvents.PERCENT_50) {
                        currentEvents.PERCENT_50 = true;
                        onTrackingEvent([AnalyticsConstants.Event.EVENT_71, AnalyticsConstants.Event.EVENT_104]);
                    }

                    break;
                }
                case 75:
                case 76: {
                    if (!currentEvents.PERCENT_75) {
                        currentEvents.PERCENT_75 = true;
                        onTrackingEvent([AnalyticsConstants.Event.EVENT_71, AnalyticsConstants.Event.EVENT_105]);
                    }

                    break;
                }
                case 99:
                case 100: {
                    if (!currentEvents.COMPLETE) {
                        currentEvents.COMPLETE = true;
                        onTrackingEvent([AnalyticsConstants.Event.EVENT_71, AnalyticsConstants.Event.EVENT_106]);
                    }

                    break;
                }
                default: {
                    break;
                }
            }
        });
    };

    sendAnalyticsEvent = events => {
        if (Sephora.configurationSettings.enableVideoTrackingEvents) {
            import(/* webpackMode: "eager" */ 'analytics/bindings/pages/all/videoLoad').then(videoLoad => {
                ProcessEvent.process(AnalyticsConstants.LINK_TRACKING_EVENT, {
                    data: {
                        bindingMethods: videoLoad,
                        eventStrings: events,
                        videoName: [this.props.name, this.props.videoId],
                        linkName: AnalyticsConstants.LinkData.VIDEO_POPUP,
                        actionInfo: AnalyticsConstants.LinkData.VIDEO_POPUP
                    }
                });
            });
        }
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
                css={styles.container}
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
        const thumbDisplayWidth = isNaN(thumbnailWidth) ? width : thumbnailWidth;

        return (
            <Box {...this.props}>
                {overlayFlag ? (
                    <Box textAlign='center'>
                        <Container
                            marginX='auto'
                            maxWidth='100%'
                            width={'100%'}
                            paddingX={0}
                            onClick={isButton ? this.openVideoModal : null}
                        >
                            <Box position='relative'>
                                <Image
                                    src={getImageSrc(imageSrc, thumbDisplayWidth)}
                                    srcSet={getImageSrc(imageSrc, thumbDisplayWidth, true)}
                                    alt={videoTitle || getText('video')}
                                    disableLazyLoad={enablePageRenderTracking || disableLazyLoad}
                                    isPageRenderImg={enablePageRenderTracking}
                                    size='100%'
                                    maxWidth={null}
                                    css={{
                                        position: 'relative',
                                        aspectRatio: '16/9',
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
                        </Container>
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
            </Box>
        );
    }
}

const styles = {
    container: {
        position: 'relative',
        aspectRatio: '16/9',
        '.vjs-big-play-button': {
            backgroundColor: 'transparent',
            outline: '5px solid white',
            boxShadow: '0px 0px 6px 0px rgba(0, 0, 0, 0.2)',
            [mediaQueries.smMax]: {
                zoom: '70%'
            }
        },
        '.bc-player-default_default:hover .vjs-big-play-button': {
            backgroundColor: '#CF112C'
        },
        '.vjs-big-play-button:active, .vjs-big-play-button:focus, .vjs-big-play-button:hover': {
            backgroundColor: '#CF112C'
        }
    }
};

Video.propTypes = {
    videoId: PropTypes.string.isRequired
};

export default wrapComponent(Video, 'Video', true);
