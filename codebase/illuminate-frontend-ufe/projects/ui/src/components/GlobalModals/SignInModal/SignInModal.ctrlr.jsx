import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import store from 'store/Store';
import localeUtils from 'utils/LanguageLocale';
import Actions from 'actions/Actions';
import Modal from 'components/Modal/Modal';
import SignInFormNew from 'components/GlobalModals/SignInModal/SignInFormNew/SignInFormNew';
import anaUtils from 'analytics/utils';

class SignInModal extends BaseClass {
    requestClose = () => {
        store.dispatch(Actions.showSignInModal({ isOpen: false }));

        //currently errback passed in only from requireLoggedInAuthentication function
        if (this.props?.errback) {
            anaUtils.trackLogoutEvent();
            this.props.errback();
        }
    };

    render() {
        const potentialBiPoints = this.props?.extraParams?.potentialBiPoints;
        const getText = localeUtils.getLocaleResourceFile('components/GlobalModals/SignInModal/SignInForm/locales', 'SignInForm');

        return (
            <Modal
                isOpen={this.props.isOpen}
                onDismiss={this.requestClose}
                width={1}
                closeDataAt={Sephora.debug.dataAt('close_button')}
                dataAt={Sephora.debug.dataAt('sign_in')}
            >
                {potentialBiPoints && (
                    <Modal.Header>
                        <Modal.Title>{getText('wantToSaveYourPoints', [potentialBiPoints])}</Modal.Title>
                    </Modal.Header>
                )}
                <Modal.Body>
                    <SignInFormNew {...this.props} />
                </Modal.Body>
            </Modal>
        );
    }
}

export default wrapComponent(SignInModal, 'SignInModal');
