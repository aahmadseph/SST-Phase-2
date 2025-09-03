import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import Modal from 'components/Modal/Modal';
import StoreAndDeliveryFlyout from 'components/ShopYourStore/StoreAndDeliveryFlyout';

function MyStoreModal(props) {
    return (
        <Modal
            isFlyout={true}
            isOpen={true}
            onDismiss={props.onDismiss}
        >
            <Modal.Header>
                <Modal.Title children={props.title} />
            </Modal.Header>
            <Modal.Body paddingBottom={4}>
                <StoreAndDeliveryFlyout
                    onDismiss={props.onDismiss}
                    happeningLinks={props.happeningLinks}
                />
            </Modal.Body>
        </Modal>
    );
}

MyStoreModal.propTypes = {
    title: PropTypes.string
};

MyStoreModal.defaultProps = {
    title: ''
};

export default wrapFunctionalComponent(MyStoreModal, 'MyStoreModal');
