/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import localeUtils from 'utils/LanguageLocale';
import store from 'store/Store';
import EditDataActions from 'actions/EditDataActions';
import FormsUtils from 'utils/Forms';

class SaveToAccountCheckbox extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            isChecked: false
        };
    }

    componentDidMount() {
        store.setAndWatch('editData.' + FormsUtils.FORMS.CHECKOUT.PAYPAL_SAVE_CHECKBOX, this, editData => {
            const data = editData[FormsUtils.FORMS.CHECKOUT.PAYPAL_SAVE_CHECKBOX] || '';
            this.setState({ isChecked: data });
        });
    }

    handleClick = event => {
        store.dispatch(EditDataActions.updateEditData(event.target.checked, FormsUtils.FORMS.CHECKOUT.PAYPAL_SAVE_CHECKBOX));
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/Checkout/Shared/PayPal/locales', 'SaveToAccountCheckbox');

        return (
            <Checkbox
                checked={this.state.isChecked}
                onClick={this.handleClick}
            >
                {getText('saveToMyAccountCheckbox')}
            </Checkbox>
        );
    }
}

export default wrapComponent(SaveToAccountCheckbox, 'SaveToAccountCheckbox', true);
