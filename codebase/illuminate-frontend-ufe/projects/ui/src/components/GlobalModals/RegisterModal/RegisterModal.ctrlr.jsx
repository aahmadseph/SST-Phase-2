import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import store from 'store/Store';
import Actions from 'Actions';

import Modal from 'components/Modal/Modal';
import RegisterForm from 'components/GlobalModals/RegisterModal/RegisterForm/RegisterForm';
import FormsUtils from 'utils/Forms';
import localeUtils from 'utils/LanguageLocale';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { getLocaleResourceFile } = LanguageLocaleUtils;

class RegisterModal extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            isHidden: false
        };
    }

    requestClose = () => {
        store.dispatch(Actions.showRegisterModal({ isOpen: false }));

        //currently errback passed in only from requireLoggedInAuthentication function
        if (this.props.errback) {
            this.props.errback();
        }

        // Remove Email Verification URL
        if (this.props.isCompleteAccountSetupModal) {
            Actions.removeEmailVerificationFromURL().then(action => {
                store.dispatch(action);
            });
        }
    };

    render() {
        const getText = getLocaleResourceFile('components/GlobalModals/RegisterModal/locales', 'RegisterModal');
        const { isCompleteAccountSetupModal } = this.props;
        const modalTitle = isCompleteAccountSetupModal ? getText('modalTitleComplete') : getText('modalTitleCreate');

        return (
            <Modal
                isOpen={this.props.isOpen}
                isHidden={this.state.isHidden}
                onDismiss={this.requestClose}
                width={1}
            >
                <Modal.Header>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <RegisterForm
                        openPostBiSignUpModal={this.props.openPostBiSignUpModal}
                        emailOptIn={localeUtils.isCanada()}
                        editStore={FormsUtils.getStoreEditSectionName(FormsUtils.FORMS.REGISTRATION_MODAL)}
                        hideModal={isHidden => this.setState({ isHidden })}
                        isRegisterModal={true}
                        {...this.props}
                        ref={c => {
                            if (c !== null) {
                                this.registerForm = c;
                            }
                        }}
                    />
                </Modal.Body>
            </Modal>
        );
    }
}

export default wrapComponent(RegisterModal, 'RegisterModal');
