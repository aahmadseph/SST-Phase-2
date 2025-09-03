import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import Modal from 'components/Modal/Modal';
import { Flex, Button, Text } from 'components/ui';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

class RemoveGiftMessageModal extends BaseClass {
    state = {
        hasError: false
    };

    handleOnRemove = async () => {
        const { deleteExistingGiftMessage, orderId } = this.props;
        const errorCallback = () => {
            this.setPageLoadAnalytics(anaConsts.PAGE_NAMES.FAILED_REMOVING_GIFT_MESSAGE_MODAL);
            this.setState({ hasError: true });
        };

        deleteExistingGiftMessage(orderId, errorCallback);
    };

    setPageLoadAnalytics = pageName => {
        return processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                pageName,
                pageType: 'modal',
                pageDetail: 'remove gift message'
            }
        });
    };

    componentDidMount() {
        this.setPageLoadAnalytics(anaConsts.PAGE_NAMES.REMOVE_GIFT_MESSAGE_MODAL);
    }

    render() {
        const {
            cancel, closeRemoveGiftMessageModal, errorMessage, gotIt, remove, title, warningMessage
        } = this.props;
        const { hasError } = this.state;

        const message = hasError ? errorMessage : warningMessage;

        return (
            <Modal
                isOpen
                onDismiss={closeRemoveGiftMessageModal}
                isDrawer
                width={0}
            >
                <Modal.Header>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Text is='p'>{message}</Text>
                </Modal.Body>
                <Modal.Footer>
                    {hasError ? (
                        <Button
                            variant='primary'
                            onClick={closeRemoveGiftMessageModal}
                            block
                        >
                            {gotIt}
                        </Button>
                    ) : (
                        <Flex justifyContent='space-between'>
                            <Button
                                variant='secondary'
                                onClick={closeRemoveGiftMessageModal}
                                block
                                marginRight={1}
                            >
                                {cancel}
                            </Button>
                            <Button
                                variant='primary'
                                onClick={this.handleOnRemove}
                                block
                                marginLeft={1}
                            >
                                {remove}
                            </Button>
                        </Flex>
                    )}
                </Modal.Footer>
            </Modal>
        );
    }
}

RemoveGiftMessageModal.propTypes = {
    cancel: PropTypes.string.isRequired,
    closeRemoveGiftMessageModal: PropTypes.func.isRequired,
    deleteGiftMessage: PropTypes.func.isRequired,
    errorMessage: PropTypes.string.isRequired,
    orderId: PropTypes.string.isRequired,
    remove: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    warningMessage: PropTypes.string.isRequired
};

export default wrapComponent(RemoveGiftMessageModal, 'RemoveGiftMessageModal');
