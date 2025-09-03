/* eslint-disable class-methods-use-this */

import React from 'react';
import Actions from 'Actions';
import UserActions from 'actions/UserActions';
import BaseClass from 'components/BaseClass';
import Modal from 'components/Modal/Modal';
import { Button, Grid, Image } from 'components/ui';
import store from 'store/Store';
import { wrapComponent } from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { getLocaleResourceFile } = LanguageLocaleUtils;

class CountrySwitcherModal extends BaseClass {
    constructor() {
        super();
        this.state = { hasCommerceItems: 0 };
    }

    componentDidMount() {
        var cart = store.getState().basket;
        this.setState({ hasCommerceItems: cart.items && cart.items.length && cart.items.length > 0 });
    }

    close = () => {
        store.dispatch(Actions.showCountrySwitcherModal(false));
    };

    switchCountry = (ctry, lang) => () => {
        store.dispatch(UserActions.switchCountry(ctry, lang));
    };

    render() {
        const getText = getLocaleResourceFile('components/GlobalModals/CountrySwitcherModal/locales', 'CountrySwitcherModal');

        const { switchCountryName } = this.props;

        const popupMsg =
            getText('popupSwitchMessage', [switchCountryName]) +
            (this.state.hasCommerceItems ? getText('popupSwitchRestrictedItemsMessage', [switchCountryName]) : '') +
            getText('popupSwitchContinueMessage');

        return (
            <Modal
                isOpen={this.props.isOpen}
                onDismiss={this.close}
                width={0}
                isDrawer={true}
            >
                <Modal.Header>
                    <Modal.Title>
                        {getText('modalTitle', [switchCountryName])}
                        <Image
                            marginLeft={3}
                            src={'/img/ufe/flags/' + this.props.desiredCountry.toLowerCase() + '.svg'}
                            height='1em'
                            css={{
                                position: 'relative',
                                top: '.125em'
                            }}
                        />
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>{popupMsg}</Modal.Body>
                <Modal.Footer hasBorder={false}>
                    <Grid columns={2}>
                        <Button
                            variant='primary'
                            data-at={Sephora.debug.dataAt('modal_dialog_continue_btn')}
                            onClick={this.switchCountry(this.props.desiredCountry, this.props.desiredLang)}
                        >
                            {getText('continueButtonLabel')}
                        </Button>
                        <Button
                            variant='secondary'
                            data-at={Sephora.debug.dataAt('modal_dialog_cancel_btn')}
                            onClick={this.close}
                        >
                            {getText('cancelButtonLabel')}
                        </Button>
                    </Grid>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default wrapComponent(CountrySwitcherModal, 'CountrySwitcherModal');
