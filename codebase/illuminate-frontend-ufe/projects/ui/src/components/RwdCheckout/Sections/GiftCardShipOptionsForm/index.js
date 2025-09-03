import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import GiftCardShipOptionsForm from 'components/RwdCheckout/Sections/GiftCardShipOptionsForm/GiftCardShipOptionsForm';
import OrderActions from 'actions/OrderActions';
import editDataSelector from 'selectors/editData/editDataSelector';
import FormsUtils from 'utils/Forms';
import checkoutApi from 'services/api/checkout';
import decorators from 'utils/decorators';
import { INTERSTICE_DELAY_MS } from 'components/RwdCheckout/constants';

const { wrapHOC } = FrameworkUtils;

const fields = createSelector(editDataSelector, editData => {
    const giftCardMessage = editData[FormsUtils.getStoreEditSectionName(FormsUtils.FORMS.CHECKOUT.GIFT_CARD_MESSAGE)];

    return {
        giftCardMessage
    };
});

const functions = dispatch => ({
    sectionSaved: path => dispatch(OrderActions.sectionSaved(path)),
    setShippingMethod: shipOptions => {
        return decorators.withInterstice(checkoutApi.setShippingMethod, INTERSTICE_DELAY_MS)(shipOptions);
    },
    updateShippingAddress: data => {
        return decorators.withInterstice(checkoutApi.updateShippingAddress, INTERSTICE_DELAY_MS)(data);
    }
});

const withGiftCardShipOptionsForm = wrapHOC(connect(fields, functions));

export default withGiftCardShipOptionsForm(GiftCardShipOptionsForm);
