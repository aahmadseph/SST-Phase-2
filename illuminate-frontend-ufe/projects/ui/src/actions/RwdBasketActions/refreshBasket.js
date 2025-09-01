import basketApi from 'services/api/basket';
import ErrorsUtils from 'utils/Errors';
import { updateBasket } from 'actions/RwdBasketActions';

function refreshBasket() {
    return dispatch => {
        return basketApi
            .getBasketDetails()
            .then(newBasket => {
                return dispatch(updateBasket({ newBasket }));
            })
            .catch(err => ErrorsUtils.renderGenericErrorModal(err.errorMessages[0]));
    };
}

export { refreshBasket };
