/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import Modal from 'components/Modal/Modal';
import { Button } from 'components/ui';
import GalleryApiServices from 'services/api/gallery';

const { deleteContent } = GalleryApiServices;

class GalleryLightBoxKebabModal extends BaseClass {
    handelDismiss = () => {
        this.props.toggleGalleryLightBoxKebabModal({ isOpen: false });
    };

    handleShare = () => {
        const { shareLink, shareSubTitle, photoId } = this.props;
        const shareUrl = `${window.location.origin}/community/gallery?photoId=${photoId}`;
        shareLink(shareUrl, shareSubTitle);
    };

    handleDelete = () => {
        const {
            isLoggedInUserPhoto = false,
            localization: {
                deleteTitle, deleteSubTitle, deleteConfirmation, done, removePhoto, cancel
            },
            photoId = '',
            toggleReportContentModal
        } = this.props;
        //lint rule disables, this modal does not run server side
        //eslint-disable-next-line
        const shareUrl = `${window.location.origin}/community/gallery?photoId=${photoId}`;

        if (isLoggedInUserPhoto) {
            this.props.deleteContentModal(deleteTitle, deleteSubTitle, removePhoto, cancel, () => {
                deleteContent(this.props.user.login, photoId).then(() => {
                    this.props.trackDeletion({ photoId });
                    this.props.deleteContentModalConfirmation(deleteTitle, deleteConfirmation, done);
                });
            });
        } else {
            toggleReportContentModal({ isOpen: true, shareUrl, photoId });
        }
    };

    render() {
        const {
            isOpen,
            isLoggedInUserPhoto = false,
            localization: {
                shareOrDelete, share, removePhoto, shareOrReport, report
            }
        } = this.props;

        return (
            <Modal
                isOpen={isOpen}
                onDismiss={this.handelDismiss}
                width={0}
                isDrawer={true}
            >
                <Modal.Header>
                    <Modal.Title>{isLoggedInUserPhoto ? shareOrDelete : shareOrReport}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Button
                        variant='secondary'
                        width={'100%'}
                        children={share}
                        onClick={this.handleShare}
                    />
                    <Button
                        variant='secondary'
                        marginTop='10px'
                        width={'100%'}
                        children={isLoggedInUserPhoto ? removePhoto : report}
                        onClick={this.handleDelete}
                    />
                </Modal.Body>
            </Modal>
        );
    }
}

export default wrapComponent(GalleryLightBoxKebabModal, 'GalleryLightBoxKebabModal', true);
