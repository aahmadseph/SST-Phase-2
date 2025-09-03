import React from 'react';
import PropTypes from 'prop-types';

import Modal from 'components/Modal/Modal';
import {
    Button, Text, Divider, Grid
} from 'components/ui';

import { wrapFunctionalComponent } from 'utils/framework';

function RemovePhoneConfirmationModal(props) {
    const { isOpen, onCancel, onContinue, localization } = props;

    return (
        <Modal
            isOpen={isOpen}
            onDismiss={onCancel}
            isDrawer={true}
            width={1}
        >
            <Modal.Header hasBorder={false}>
                <Modal.Title>{localization.title}</Modal.Title>
            </Modal.Header>
            <Divider />
            <Modal.Body>
                <Text
                    is='p'
                    fontSize='md'
                    dangerouslySetInnerHTML={{
                        __html: localization.message
                    }}
                />
                <Text
                    is='p'
                    fontSize='md'
                    marginTop={4}
                    dangerouslySetInnerHTML={{
                        __html: localization.messageLine2
                    }}
                />
            </Modal.Body>
            <Modal.Footer>
                <Grid
                    gap={4}
                    columns={2}
                >
                    <Button
                        variant='primary'
                        width={['100%', null, 164]}
                        children={localization.cancel}
                        onClick={onCancel}
                        marginX='auto'
                    />
                    <Button
                        variant='secondary'
                        width={['100%', null, 164]}
                        children={localization.ok}
                        onClick={onContinue}
                        marginX='auto'
                    />
                </Grid>
            </Modal.Footer>
        </Modal>
    );
}

RemovePhoneConfirmationModal.propTypes = {
    localization: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onContinue: PropTypes.func.isRequired
};

export default wrapFunctionalComponent(RemovePhoneConfirmationModal, 'RemovePhoneConfirmationModal');
