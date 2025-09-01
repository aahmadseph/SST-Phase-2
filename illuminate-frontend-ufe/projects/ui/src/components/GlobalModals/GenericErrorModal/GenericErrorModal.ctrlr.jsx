import React from 'react';
import BaseClass from 'components/BaseClass';
import Modal from 'components/Modal';
import { Button } from 'components/ui';
import GenericErrorContent from 'components/GlobalModals/GenericErrorModal/GenericErrorContent';
import { mediaQueries, shadows, space } from 'style/config';

const MODAL_WIDTH = 4;

class GenericErrorModal extends BaseClass {
    render() {
        const {
            isOpen, requestClose, localization, title, header, content, cta
        } = this.props;

        if (!isOpen) {
            return null;
        }

        const modalTitle = title || localization?.title;
        const contentHeader = header || localization?.header;
        const contentText = content || localization?.content;
        const buttonText = cta || localization?.cta;

        return (
            <Modal
                isOpen={isOpen}
                isDrawer={true}
                width={MODAL_WIDTH}
                onDismiss={requestClose}
                shouldCloseOnOverlayClick={true}
                shouldCloseOnEsc={true}
                contentLabel={modalTitle}
            >
                <Modal.Header>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <GenericErrorContent
                        header={contentHeader}
                        content={contentText}
                    />
                </Modal.Body>
                <Modal.Footer style={styles.modalFooter}>
                    <Button
                        title={buttonText}
                        width={['100%', null, 360]}
                        variant='primary'
                        onClick={requestClose}
                    >
                        {buttonText}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

const styles = {
    modalBody: {
        paddingBottom: 0
    },
    modalFooter: {
        display: 'flex',
        alignItems: 'center',
        padding: `10px ${space[5]}px`,
        boxShadow: shadows.light,
        justifyContent: 'flex-end',
        [mediaQueries.sm]: {
            bottom: 0
        }
    }
};

export default GenericErrorModal;
