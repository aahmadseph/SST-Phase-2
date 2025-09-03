/* eslint-disable class-methods-use-this */
import React from 'react';
import watch from 'redux-watch';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Button } from 'components/ui';
import locationUtils from 'utils/Location';
import localeUtils from 'utils/LanguageLocale';
import store from 'store/Store';
import checkoutUtils from 'utils/Checkout';
import basketUtils from 'utils/Basket';
import anaUtils from 'analytics/utils';
import UtilActions from 'utils/redux/Actions';
import AddToBasketActions from 'actions/AddToBasketActions';
import urlUtils from 'utils/Url';
import Debounce from 'utils/Debounce';

class CheckoutButton extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            basket: {
                items: []
            }
        };
    }

    static defaultProps = {
        variant: 'special'
    };

    componentDidMount() {
        const basket = basketUtils.getCurrentBasketData();
        const watchBasket = watch(store.getState, 'basket');

        this.setState({ basket });

        store.subscribe(watchBasket(this.updateState), this);
        store.watchAction(AddToBasketActions.TYPES.SET_BASKET_TYPE, this.updateState);
    }

    updateState = () => {
        this.setState({ basket: basketUtils.getCurrentBasketData() });
    };

    //TODO: Refactor to get this business logic out of the checkout button components
    // (regular, apple pay, paypal - almost identical functionality in all three
    checkout = () => {
        if (this.props.isShowCheckoutActive) {
            const basket = basketUtils.getCurrentBasketData();

            if (basket.warnings) {
                return urlUtils.redirectTo('/basket');
            }

            const basketType = this.props.isBopis ? AddToBasketActions.BASKET_TYPES.BOPIS_BASKET : AddToBasketActions.BASKET_TYPES.DC_BASKET;
            store.dispatch(AddToBasketActions.setBasketType(basketType));
        }

        this.standardCheckoutClicked();
        // Disable applePay session, if it was active
        store.dispatch(UtilActions.merge('applePaySession', 'isActive', false));

        if (this.props.isShowCheckoutActive && this.props.toggleATBModalOpen) {
            this.props.toggleATBModalOpen(false);
        }

        return checkoutUtils
            .initializeCheckout({ ropisCheckout: basketUtils.isPickup() })
            .then(checkoutUtils.initOrderSuccess)
            .catch(e => checkoutUtils.initOrderFailure(e, this.props.isShowCheckoutActive));
    };

    standardCheckoutClicked = () => {
        // Set custom flag in order to fire s.tl call on the next page (ILLUPH-135938)

        anaUtils.setNextPageData({
            customData: {
                clickCheckout: true,
                previousPageName: digitalData.page.attributes?.previousPageData?.pageName,
                pageType: digitalData.page.category.pageType,
                pageDetail: digitalData.page.pageInfo.pageName,
                pageName: digitalData.page.attributes?.sephoraPageInfo?.pageName,
                linkName: this.props.linkName
            },
            pageName: digitalData.page.attributes?.sephoraPageInfo?.pageName
        });
    };

    debouncedCheckoutClick = Debounce.preventDoubleClick(this.checkout, 3000);

    handleCheckoutClick = () => {
        const { isLinkWhenEmpty } = this.props;
        const isBasketEmpty = this.isBasketEmpty();
        const isLink = isLinkWhenEmpty && isBasketEmpty;

        typeof this.props.triggerLinkTrackingOnClick === 'function' && this.props.triggerLinkTrackingOnClick();

        if (!isLink) {
            this.debouncedCheckoutClick();
        }
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/CheckoutButton/locales', 'CheckoutButton');

        const { isLinkWhenEmpty, children, isBopis, ...props } = this.props;

        const isBasketEmpty = this.isBasketEmpty();
        const isLink = isLinkWhenEmpty && isBasketEmpty;

        return (
            <React.Fragment>
                <Button
                    {...props}
                    disabled={isBasketEmpty && !isLink}
                    href={isLink ? '/basket' : null}
                    data-at={!isLink ? Sephora.debug.dataAt('basket_checkout_btn') : null}
                    onClick={this.handleCheckoutClick}
                >
                    {children ? children : getText('checkoutButton')}
                </Button>
            </React.Fragment>
        );
    }

    isBasketEmpty = () => {
        const { isBopis } = this.props;
        const dcBasketItems = this.state.basket?.items;
        const pickupBasketItems = this.state.basket?.pickupBasket?.items;
        let basketItems = dcBasketItems;

        if (isBopis && pickupBasketItems?.length > 0) {
            basketItems = pickupBasketItems;
        }

        let isBasketEmpty = !basketItems || !basketItems.length;

        if (basketItems.length === 1) {
            const basketItem = basketItems[0];
            isBasketEmpty = basketItem.sku.isOutOfStock && locationUtils.isCheckout();
        }

        return isBasketEmpty;
    };
}

export default wrapComponent(CheckoutButton, 'CheckoutButton', true);
