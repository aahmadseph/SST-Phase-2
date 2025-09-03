/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import store from 'Store';
import watch from 'redux-watch';
import TermsAndConditionsActions from 'actions/TermsAndConditionsActions';
import MediaPopup from 'components/GlobalModals/MediaPopup/MediaPopup';
import InfoModal from 'components/GlobalModals/InfoModal/InfoModal';

const { showModal: showTermsConditions } = TermsAndConditionsActions;

class TermsConditionsModal extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            mediaId: '',
            title: '',
            message: ''
        };
    }

    componentDidMount() {
        const termsConditionsWatch = watch(store.getState, 'termsConditions');
        store.subscribe(
            termsConditionsWatch(newVal => this.setState(newVal)),
            this
        );
    }

    requestClose = () => {
        store.dispatch(showTermsConditions(false));
    };

    render() {
        return this.state.mediaId ? (
            <div>
                {
                    <MediaPopup
                        showContent={true}
                        isOpen={this.state.isOpen}
                        mediaId={this.state.mediaId}
                        onDismiss={this.requestClose}
                        title={this.state.title}
                        contentDataAt='terms_condition_content'
                        dataAt='TermsConditionsModal'
                    />
                }
            </div>
        ) : this.state.message ? (
            <div>
                <InfoModal
                    isOpen={this.state.isOpen}
                    title={this.state.title}
                    message={this.state.message}
                    cancelCallback={this.requestClose}
                    dataAt='TermsConditionsModal'
                />
            </div>
        ) : null;
    }
}

export default wrapComponent(TermsConditionsModal, 'TermsConditionsModal');
