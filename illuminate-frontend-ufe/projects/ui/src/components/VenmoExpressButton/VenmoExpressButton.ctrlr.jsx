/* eslint-disable class-methods-use-this */
import { Button, Image } from 'components/ui';
import { colors } from 'style/config';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import Venmo from 'utils/Venmo';
import VenmoBindings from 'analytics/bindingMethods/pages/checkout/VenmoBindings';

const venmoButtonStyle = {
    borderWidth: 0,
    backgroundColor: colors.venmoBlue
};

class VenmoExpressButton extends BaseClass {
    constructor(props) {
        super(props);

        this.state = { isDisabled: false };
    }

    componentDidMount() {
        // Check if the user is returning to basket after Venmo auth
        Venmo.onBasketReload({ isBopis: this.props.isBopis });
    }

    checkoutWithVenmo = () => {
        VenmoBindings.expressCheckoutClick();
        Venmo.triggerExpressCheckout({ isBopis: this.props.isBopis });
    };

    render() {
        const { isDisabled } = this.state;

        return (
            <Button
                variant='secondary'
                onClick={this.checkoutWithVenmo}
                disabled={isDisabled}
                data-at={Sephora.debug.dataAt('basket_venmo_btn')}
                css={venmoButtonStyle}
                {...this.props}
            >
                <Image
                    disableLazyLoad={true}
                    alt='Venmo'
                    src='/img/ufe/payments/no-border/venmo.svg'
                    verticalAlign='middle'
                />
                <span
                    id='venmo-container'
                    style={{ display: 'none' }}
                />
            </Button>
        );
    }
}

export default wrapComponent(VenmoExpressButton, 'VenmoExpressButton', true);
