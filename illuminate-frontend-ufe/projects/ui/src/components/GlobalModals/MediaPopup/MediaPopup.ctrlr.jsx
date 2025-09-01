import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import Modal from 'components/Modal/Modal';
import Html from 'components/Html/Html';
import BccComponentList from 'components/Bcc/BccComponentList/BccComponentList';
import { Button, Link } from 'components/ui';

import cmsApi from 'services/api/cms';
import store from 'Store';
import Actions from 'Actions';

class MediaPopup extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            regions: null,
            isOpen: this.props.isOpen
        };
    }

    componentDidMount() {
        if (this.state.regions === null) {
            this.getMediaContent(this.props.mediaId);
        }
    }

    getTemplate = template => {
        const regions = this.state.regions;

        if (regions && regions[template] && regions[template].length) {
            return (
                <BccComponentList
                    items={regions[template]}
                    markdownCallback={this.props.callback}
                />
            );
        }

        return null;
    };

    getMediaContent = mediaId => {
        cmsApi.getMediaContent(mediaId).then(data => {
            this.setState({
                regions: data.regions,
                mediaTitle: data.title
            });
        });
    };

    requestClose = () => {
        if (this.props?.onDismiss && typeof this.props?.onDismiss === 'function') {
            this.props.onDismiss();
        } else {
            store.dispatch(Actions.showMediaModal({ isOpen: false }));
        }
    };

    componentWillReceiveProps(updatedProps) {
        this.setState({ isOpen: updatedProps.isOpen });

        if (updatedProps.mediaId) {
            this.getMediaContent(updatedProps.mediaId);
        }
    }

    render() {
        const {
            title,
            width,
            dataAt,
            onClose,
            bodyDataAt,
            showContent,
            showDismiss,
            titleDataAt,
            contentDataAt,
            backHandler,
            onCloseDataAt,
            backDataAt,
            showMediaTitle,
            dismissButtonText,
            dismissButtonDataAt
        } = this.props;

        const closeModal = onClose || this.requestClose;

        const left = this.state.regions && this.state.regions.left ? this.state.regions.left : null;

        let content = null;

        if (showContent) {
            content = this.getTemplate('content');
        }

        const modalTitle = showMediaTitle ? this.state.mediaTitle : title;

        if (this.isBccModal) {
            return content;
        } else {
            return (
                <Modal
                    isDrawer
                    isOpen={this.state.isOpen && !!this.state.regions}
                    onDismiss={closeModal}
                    closeDataAt={onCloseDataAt}
                    showDismiss={showDismiss}
                    width={width}
                    dataAt={dataAt}
                >
                    {modalTitle && (
                        <Modal.Header isLeftAligned={backHandler}>
                            <Modal.Title data-at={Sephora.debug.dataAt(titleDataAt)}>
                                {backHandler ? (
                                    <Link
                                        padding={2}
                                        margin={-2}
                                        data-at={backDataAt}
                                        arrowPosition='before'
                                        arrowDirection='left'
                                        onClick={backHandler}
                                        children={modalTitle}
                                    />
                                ) : (
                                    modalTitle
                                )}
                            </Modal.Title>
                        </Modal.Header>
                    )}
                    <Modal.Body
                        padForX={!modalTitle}
                        bodyDataAt={bodyDataAt}
                    >
                        {left &&
                            left.length &&
                            left.map((html, index) => (
                                <Html
                                    key={index.toString()}
                                    className={html.style && html.style.classes}
                                    content={html.text}
                                />
                            ))}
                        <div data-at={contentDataAt ? Sephora.debug.dataAt(contentDataAt) : null}>
                            {this.getTemplate('content')}
                            {this.getTemplate('right')}
                        </div>
                    </Modal.Body>
                    {dismissButtonText && (
                        <Modal.Footer>
                            <Button
                                variant='primary'
                                hasMinWidth={true}
                                width={['100%', 'auto']}
                                data-at={Sephora.debug.dataAt(dismissButtonDataAt)}
                                onClick={closeModal}
                                children={dismissButtonText}
                            />
                        </Modal.Footer>
                    )}
                </Modal>
            );
        }
    }
}

export default wrapComponent(MediaPopup, 'MediaPopup');
