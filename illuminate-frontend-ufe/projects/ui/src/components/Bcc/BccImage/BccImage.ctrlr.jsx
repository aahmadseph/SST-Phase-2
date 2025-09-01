import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { site, space } from 'style/config';
import { Box, Image } from 'components/ui';
import UrlUtils from 'utils/Url';
import navClickBindings from 'analytics/bindingMethods/pages/all/navClickBindings';
import BccBase from 'components/Bcc/BccBase/BccBase';
import ImageUtils from 'utils/Image';
import store from 'Store';
import actions from 'Actions';
import BCC from 'utils/BCC';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

const { getLink, addInternalTracking, isAbsoluteUrl } = UrlUtils;
const { trackNavClick } = navClickBindings;
const { getImageSrc } = ImageUtils;
const MULTISHADEFINDER = 'MULTISHADEFINDER';

class BccImage extends BaseClass {
    state = {
        hover: false
    };

    toggleHover = () => {
        if (!Sephora.isTouch && Sephora.isDesktop()) {
            this.setState({ hover: !this.state.hover });
        }
    };

    trackExternalLinkClick = fieldName => {
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                internalCampaign: fieldName,
                linkName: this.props.name
            }
        });
    };

    toggleOpen = modalTemplate => {
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                internalCampaign: this.props.name,
                linkName: this.props.name
            }
        });
        store.dispatch(
            actions.showBccModal({
                isOpen: true,
                bccModalTemplate: modalTemplate,
                bccParentComponentName: this.props.componentName
            })
        );
    };

    clickBccImage = targetScreen => {
        if (targetScreen && targetScreen.targetWindow === 1) {
            this.trackExternalLinkClick(this.props.name);
        }
    };

    handleTestTarget = data => {
        const keys = ['altText', 'bannerImageUrl', 'landingPageUrl'];
        const missingKeys = keys.filter(key => typeof data[key] === 'undefined');

        if (missingKeys.length) {
            return null;
        }

        const {
            altText, bannerImageUrl, landingPageUrl, width = '980', height = Sephora.isMobile() ? '170' : '60'
        } = data;

        return {
            altText,
            imagePath: bannerImageUrl,
            targetScreen: { targetUrl: landingPageUrl },
            componentType: BCC.COMPONENT_NAMES.IMAGE,
            width,
            height
        };
    };

    // eslint-disable-next-line complexity
    render() {
        const isMobile = Sephora.isMobile();

        /* eslint-disable prefer-const */
        let {
            name,
            isContained,
            altText,
            width,
            height,
            imagePath,
            imageId,
            secondaryImagePath,
            targetScreen,
            modalComponentTemplate,
            hotSpots,
            parentTitle,
            contextualParentTitles,
            enablePageRenderTracking = false,
            origin,
            dataAt,
            displayTitle
        } = this.props;
        /* eslint-enable prefer-const */

        width = parseInt(width);
        height = parseInt(height);
        const withRatio = !!(width && height);

        const imageAttrs = {
            alt: altText ? altText : null,
            css: withRatio
                ? {
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: 0,
                    bottom: 0,
                    left: 0
                }
                : {
                    maxWidth: '100%',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }
        };

        const anaNavPath = () => {
            const path = [parentTitle, 'image'];

            return path;
        };

        const isShadeFinderImage = targetScreen?.targetUrl === MULTISHADEFINDER;
        let imgTargetUrl = targetScreen?.targetUrl;
        let isExternalUrl = null;

        if (imgTargetUrl && !isShadeFinderImage) {
            isExternalUrl = isAbsoluteUrl(imgTargetUrl) && imgTargetUrl.indexOf('sephora.com') === -1;

            if (imgTargetUrl.indexOf('icid2') === -1) {
                if (origin) {
                    name = origin + ':' + name;
                }

                if (!isExternalUrl) {
                    imgTargetUrl = addInternalTracking(targetScreen.targetUrl, [name]);
                }
            }
        }

        const onHover = secondaryImagePath ? this.toggleHover : null;

        return (
            <BccBase
                {...this.props}
                className='BccImage'
                baseCss={
                    isContained && [
                        {
                            marginLeft: -space.container,
                            marginRight: -space.container
                        },
                        !isMobile &&
                            width > site.MIN_WIDTH_FS && {
                            [`@media (min-width: ${site.MIN_WIDTH_FS}px)`]: {
                                width: '100vw',
                                position: 'relative',
                                left: '50%',
                                marginLeft: '-50vw',
                                marginRight: 'auto'
                            }
                        }
                    ]
                }
            >
                <Box
                    className='BccImage-inner'
                    href={isShadeFinderImage ? null : getLink(imgTargetUrl)}
                    target={targetScreen && targetScreen.targetWindow === 1 ? '_blank' : null}
                    onMouseEnter={onHover}
                    onFocus={onHover}
                    onMouseLeave={onHover}
                    onBlur={onHover}
                    data-at={Sephora.debug.dataAt(dataAt)}
                    onClick={
                        imgTargetUrl || modalComponentTemplate
                            ? e => {
                                if (isShadeFinderImage) {
                                    store.dispatch(actions.showWizard(true, undefined, this.props.name.toLowerCase()));
                                }

                                if (parentTitle) {
                                    trackNavClick(anaNavPath());
                                } else if (contextualParentTitles) {
                                    trackNavClick(contextualParentTitles.concat(['image']));
                                }

                                if (modalComponentTemplate) {
                                    e.preventDefault();
                                    this.toggleOpen(modalComponentTemplate);
                                }
                            }
                            : null
                    }
                    position='relative'
                    maxWidth='100%'
                    marginX='auto'
                    style={{ width }}
                >
                    {withRatio && (
                        <div
                            style={{
                                paddingBottom: `${(height / width) * 100}%`
                            }}
                        />
                    )}

                    <Image
                        display={this.state.hover ? 'none' : 'block'}
                        title={displayTitle}
                        data-at={Sephora.debug.dataAt('bcc_image_' + name)}
                        disableLazyLoad={true}
                        isPageRenderImg={enablePageRenderTracking}
                        src={getImageSrc(imagePath, width)}
                        srcSet={getImageSrc(imagePath, width, true)}
                        {...imageAttrs}
                        id={imageId}
                    />

                    {secondaryImagePath && !Sephora.isTouch && (
                        <Image
                            display={this.state.hover ? 'block' : 'none'}
                            disableLazyLoad={true}
                            src={getImageSrc(secondaryImagePath, width)}
                            srcSet={getImageSrc(secondaryImagePath, width, true)}
                            {...imageAttrs}
                        />
                    )}

                    {hotSpots &&
                        hotSpots.map((hotSpot, index) => {
                            const cords = hotSpot.hotSpotCords.split(',');

                            return (
                                <a
                                    key={index.toString()}
                                    title={hotSpot.altText}
                                    href={getLink(hotSpot.targetScreen.targetUrl, [hotSpot.hotSpotName])}
                                    css={{
                                        position: 'absolute',
                                        top: `${(cords[1] / height) * 100}%`,
                                        left: `${(cords[0] / width) * 100}%`,
                                        width: `${((cords[2] - cords[0]) / width) * 100}%`,
                                        height: `${((cords[3] - cords[1]) / height) * 100}%`
                                    }}
                                    {...(hotSpot.targetScreen.targetWindow === 1
                                        ? {
                                            target: '_blank',
                                            rel: 'noopener noreferrer'
                                        }
                                        : null)}
                                />
                            );
                        })}
                </Box>
            </BccBase>
        );
    }
}

export default wrapComponent(BccImage, 'BccImage', true);
