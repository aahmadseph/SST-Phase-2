import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import RwdBasketActions from 'actions/RwdBasketActions/RwdBasketActions';
import store from 'store/Store';
import { Text, Link } from 'components/ui';
import DeliveryFrequencyModal from 'components/GlobalModals/DeliveryFrequencyModal';
import deliveryFrequencyUtils from 'utils/DeliveryFrequency';
import localeUtils from 'utils/LanguageLocale';

const { dispatch } = store;
const { updateSkuQuantity } = RwdBasketActions;
const { getFormattedDeliveryFrequency, getReplenFrequencyNumAndType } = deliveryFrequencyUtils;
const { getLocaleResourceFile } = localeUtils;

class DeliveryFrequency extends BaseClass {
    constructor(props) {
        super(props);

        this.state = { showDeliveryFrequencyModal: false };
    }

    toggleDeliveryFrequencyModal = () => {
        this.setState(prevState => ({ showDeliveryFrequencyModal: !prevState.showDeliveryFrequencyModal }));
    };

    render() {
        const { item } = this.props;

        const getText = getLocaleResourceFile('components/RwdBasket/Carts/AutoreplenishCart/BelowProductPrice/locales', 'DeliveryFrequency');

        const { replenishmentFreqNum, replenishmentFreqType } = getReplenFrequencyNumAndType(item);
        const deliveryFrequency = getFormattedDeliveryFrequency(item);

        return (
            <>
                <Link
                    display='block'
                    fontSize={['sm', 'base']}
                    marginTop={3}
                    arrowDirection='down'
                    onClick={this.toggleDeliveryFrequencyModal}
                    data-at={Sephora.debug.dataAt('bsk_deliver_every')}
                >
                    {`${getText('deliveryEvery')} `}
                    <Text fontWeight='bold'>{deliveryFrequency}</Text>
                </Link>
                {this.state.showDeliveryFrequencyModal && (
                    <DeliveryFrequencyModal
                        isOpen={this.state.showDeliveryFrequencyModal}
                        onDismiss={this.toggleDeliveryFrequencyModal}
                        title={getText('deliveryFrequency')}
                        isBasket={true}
                        currentProduct={item}
                        replenishmentFreqNum={replenishmentFreqNum}
                        replenishmentFreqType={replenishmentFreqType}
                        updateFrequencyModal={({ currentProduct }) => {
                            dispatch(
                                updateSkuQuantity({
                                    commerceId: currentProduct.commerceId,
                                    newQty: 1,
                                    isBopis: false,
                                    replenishmentFrequency: currentProduct.replenishmentFrequency
                                })
                            );
                            this.toggleDeliveryFrequencyModal();
                        }}
                    />
                )}
            </>
        );
    }
}

export default wrapComponent(DeliveryFrequency, 'DeliveryFrequency');
