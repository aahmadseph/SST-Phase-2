import React from 'react';
import Actions from 'Actions';
import store from 'Store';
import BaseClass from 'components/BaseClass';
import Modal from 'components/Modal/Modal';
import ColorIQ from 'components/RichProfile/EditMyProfile/Content/ColorIQ/ColorIQ';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import { wrapComponent } from 'utils/framework';

const { getLocaleResourceFile } = LanguageLocaleUtils;

class ColorIQModal extends BaseClass {
    constructor() {
        super();
        this.state = {
            biAccount: null
        };
    }

    componentDidMount() {
        store.setAndWatch({ 'user.beautyInsiderAccount': 'biAccount' }, this, null, true);
    }

    requestClose = () => {
        this.props.callback && this.props.callback();
        store.dispatch(Actions.showColorIQModal(false));
    };

    render() {
        const getText = getLocaleResourceFile('components/GlobalModals/ColorIQModal/locales', 'ColorIQModal');

        return (
            <Modal
                isOpen={this.props.isOpen}
                onDismiss={this.requestClose}
                hasBodyScroll={true}
                width={4}
                dataAt='ColorMatchesPopup'
            >
                <Modal.Header>
                    <Modal.Title>{getText('colorIQMatches')}</Modal.Title>
                </Modal.Header>

                <Modal.Body maxHeight={492}>{this.state.biAccount && <ColorIQ biAccount={this.state.biAccount} />}</Modal.Body>
            </Modal>
        );
    }
}

export default wrapComponent(ColorIQModal, 'ColorIQModal');
