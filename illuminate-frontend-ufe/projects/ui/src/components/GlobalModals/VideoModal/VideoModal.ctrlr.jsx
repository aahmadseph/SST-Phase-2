/* eslint-disable class-methods-use-this */
import React from 'react';

import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import Modal from 'components/Modal/Modal';
import store from 'Store';
import Actions from 'Actions';

class VideoModal extends BaseClass {
    state = {};

    render() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                onDismiss={this.isDone}
                width={5}
            >
                {this.props.videoTitle && (
                    <Modal.Header>
                        <Modal.Title>{this.props.videoTitle}</Modal.Title>
                    </Modal.Header>
                )}
                <Modal.Body>
                    <div ref={videoWrapper => videoWrapper && this.props.videoModalUpdated(videoWrapper)}>{this.props.video}</div>
                </Modal.Body>
            </Modal>
        );
    }

    isDone = () => {
        store.dispatch(Actions.showVideoModal({ isOpen: false }));
    };
}

export default wrapComponent(VideoModal, 'VideoModal', true);
