/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import pixleeUtils from 'utils/pixlee';

import lithiumApi from 'services/api/thirdparty/Lithium';
import galleryConstants from 'utils/GalleryConstants';

import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import helpersUtils from 'utils/Helpers';
import Empty from 'constants/empty';
const { deferTaskExecution } = helpersUtils;

const {
    loadPixlee, EVENT_NAMES, EVENT_TYPES, UPLOADER_WIDGET_ID, getApprovedContentForPhoto
} = pixleeUtils;
const { khorosInteractions } = galleryConstants;

let albumIds = [];
class PixleeUploader extends BaseClass {
    openPixleeUploader = () => {
        const { login: email = '', nickName: name = '', profileId } = this.props.user || {};
        window.Pixlee.openUploader({
            widgetId: UPLOADER_WIDGET_ID,
            profile: {
                email,
                name,
                isImmutable: true,
                vendorId: profileId
            }
        });
        window.addEventListener('message', this.listenPixleeEvents);
        window.Pixlee.resizeWidget();
    };

    fireAnalytics = photoIds => {
        deferTaskExecution(() => {
            processEvent.process(anaConsts.SELECT_CONTENT_EVENT, {
                data: {
                    linkName: 'photo_upload',
                    photoId: (photoIds || Empty.Array).join(',')
                }
            });
        });
    };

    listenPixleeEvents = event => {
        let message;

        if (typeof event.data === 'string') {
            try {
                message = JSON.parse(event.data);
            } catch {
                message = event.data;
            }

            const isStringMsg = typeof message === 'string';

            if (!isStringMsg && message.name === EVENT_NAMES.completed && message.type === EVENT_TYPES.action) {
                albumIds = message.data?.uploadedAlbumPhotoIds;

                if (typeof this.props.successCallback === 'function') {
                    this.props.successCallback();
                }

                this.fireAnalytics(albumIds || Empty.Array);
            }

            if ((isStringMsg && message === EVENT_NAMES.closeString) || message.name === EVENT_NAMES.close) {
                albumIds?.forEach(albumId => {
                    setTimeout(
                        getApprovedContentForPhoto(albumId, false).then(data => {
                            if (data?.data) {
                                const interaction =
                                    data?.data?.content_type === 'video' ? khorosInteractions.VIDEO_UPLOADED : khorosInteractions.PHOTO_UPLOADED;
                                lithiumApi.incrementUserScoreForPixlee(interaction, 1);
                            }
                        }),
                        1000
                    );
                });
                albumIds = [];
                this.props.closeUploader();
            }
        }
    };
    componentDidMount() {
        loadPixlee();

        if (window.Pixlee) {
            this.openPixleeUploader();
        } else {
            window.addEventListener('PixleeLoaded', this.openPixleeUploader);
        }
    }
    componentWillUnmount() {
        window.removeEventListener('PixleeLoaded', this.openPixleeUploader);
        window.removeEventListener('message', this.listenPixleeEvents);
    }
    render() {
        return <></>;
    }
}

export default wrapComponent(PixleeUploader, 'PixleeUploader', true);
