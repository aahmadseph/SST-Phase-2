/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import store from 'Store';
import Actions from 'Actions';
import cmsApi from 'services/api/cms';
import Modal from 'components/Modal/Modal';
import BccComponentList from 'components/Bcc/BccComponentList/BccComponentList';

const { showUFEModal } = Actions;

class UFEModal extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: this.props.isOpen,
            modalComponent: { components: null }
        };
    }

    componentDidMount() {
        const { ufeModalId } = this.props;

        if (ufeModalId) {
            cmsApi.getUFEComponentContent(ufeModalId).then(data => {
                this.setState({ modalComponent: data });
            });
        }
    }

    requestClose = () => {
        store.dispatch(showUFEModal({ isOpen: false }));
    };

    render() {
        const { isOpen, modalComponent } = this.state;

        return (
            <Modal
                isOpen={isOpen}
                onDismiss={this.requestClose}
            >
                <Modal.Body padForX={true}>
                    <BccComponentList
                        items={modalComponent.components}
                        isContained={Sephora.isMobile()}
                    />
                </Modal.Body>
            </Modal>
        );
    }
}

export default wrapComponent(UFEModal, 'UFEModal');
