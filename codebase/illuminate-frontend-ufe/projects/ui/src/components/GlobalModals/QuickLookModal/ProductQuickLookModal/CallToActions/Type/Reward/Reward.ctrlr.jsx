import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import store from 'store/Store';
import productActions from 'actions/ProductActions';
import userUtils from 'utils/User';
import profileApi from 'services/api/profile';

import BasketUtils from 'utils/Basket';
import BiQualify from 'components/BiQualify/BiQualify';
import AddToBasketButton from 'components/AddToBasketButton';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import skuHelpers from 'utils/skuHelpers';

const { getLocaleResourceFile } = LanguageLocaleUtils;
const { ADD_TO_BASKET_TYPES: ADD_BUTTON_TYPE } = BasketUtils;

class Reward extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            isBI: false,
            isInBasket: false
        };
    }
    componentDidMount() {
        store.setAndWatch('user', this, data => {
            if (data.user) {
                this.setState({ isBI: userUtils.isBI() });
            }
        });

        store.setAndWatch('basket.items', this, (items, oldItems) => {
            // Only make the API call if oldItems exist to avoid an extra call on page load
            if (items && oldItems) {
                const { currentProduct } = this.props;
                const productId = currentProduct?.productDetails?.productId;
                const isInBasket = skuHelpers.isInBasket(currentProduct?.currentSku?.skuId || currentProduct?.skuId, { items: items });
                this.setState({ isInBasket });

                profileApi.getUserSpecificProductDetails(productId).then(productData => {
                    store.dispatch(productActions.updateCurrentUserSpecificProduct(productData));
                });
            }
        });
    }

    render() {
        const getText = getLocaleResourceFile('components/GlobalModals/QuickLookModal/ProductQuickLookModal/CallToActions/locales', 'Reward');

        const { currentProduct } = this.props;

        const { currentSku, currentSkuQuantity, currentProductUserSpecificDetails = {} } = currentProduct;

        const { isBI, isInBasket } = this.state;

        let { isEligible } = currentProductUserSpecificDetails;

        const { calculateIsInBasketFlagOnChannel } = Sephora.configurationSettings;
        const isSkuInBasket = calculateIsInBasketFlagOnChannel ? isInBasket : currentProductUserSpecificDetails.isInBasket;

        if (typeof isEligible === 'undefined' && currentProductUserSpecificDetails.currentSku) {
            isEligible = currentProductUserSpecificDetails.currentSku.isEligible;
        }

        const isDisabled = isSkuInBasket ? false : !isEligible;

        return (
            <div>
                {isBI || (
                    <BiQualify
                        marginBottom={2}
                        fontSize={Sephora.isMobile() ? 'base' : 'sm'}
                        currentSku={currentSku}
                    />
                )}
                <AddToBasketButton
                    block={true}
                    quantity={currentSkuQuantity}
                    product={currentProduct}
                    sku={currentSku}
                    text={isSkuInBasket ? getText('remove') : null}
                    variant={isSkuInBasket ? ADD_BUTTON_TYPE.PRIMARY : ADD_BUTTON_TYPE.SPECIAL}
                    disabled={isDisabled}
                />
            </div>
        );
    }
}

export default wrapComponent(Reward, 'Reward');
