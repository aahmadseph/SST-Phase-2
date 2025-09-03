import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal/Modal';
import { wrapFunctionalComponent } from 'utils/framework';
import { Button, Text, Divider } from 'components/ui';
import { space } from 'style/config';

const ModifySubscriptionErrorModal = props => {
    const {
        isOpen, onDismiss, modifySubscription, errorMessage, done
    } = props;

    return (
        <Modal
            width={0}
            onDismiss={onDismiss}
            isOpen={isOpen}
            isDrawer={true}
        >
            <Modal.Header>
                <Modal.Title children={modifySubscription} />
            </Modal.Header>
            <Modal.Body css={styles.marginBottom}>
                <Text
                    fontSize='base'
                    is='p'
                />
                {errorMessage}
            </Modal.Body>
            <Divider />
            <Modal.Footer css={styles.paddingTop}>
                <Button
                    variant='primary'
                    width='100%'
                    onClick={onDismiss}
                >
                    {done}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

const styles = {
    paddingTop: {
        paddingTop: `${space[4]}px`
    },
    marginBottom: {
        paddingBottom: `${space[4]}px`
    }
};

ModifySubscriptionErrorModal.defaultProps = {};

ModifySubscriptionErrorModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onDismiss: PropTypes.func.isRequired,
    modifySubscription: PropTypes.string.isRequired,
    errorMessage: PropTypes.string.isRequired,
    done: PropTypes.string.isRequired
};

export default wrapFunctionalComponent(ModifySubscriptionErrorModal, 'ModifySubscriptionErrorModal');
