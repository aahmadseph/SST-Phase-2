/* eslint-disable max-len */

import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Text, Divider } from 'components/ui';
import ProductListItem from 'components/Product/ProductListItem/ProductListItem';
import dateUtils from 'utils/Date';
import store from 'store/Store';
import actions from 'actions/Actions';

class Service extends BaseClass {
    showFindInStore = function (e, sku) {
        e.preventDefault();
        store.dispatch(actions.showFindInStoreModal(true, sku));
    };

    render() {
        const { service } = this.props;

        return (
            <div>
                <Text
                    is='h2'
                    lineHeight='tight'
                    textAlign='center'
                    fontSize={[null, 'md']}
                    css={{ whiteSpace: 'normal' }}
                >
                    {`${dateUtils.getDateInMMDDYYYY(service.dateToDisplay)} at Sephora ${service.store.displayName}`}
                    <br />
                    {service.serviceName}
                </Text>
                {service.skus.map(sku => {
                    return (
                        <React.Fragment key={sku.skuId}>
                            <Divider marginY={4} />
                            <ProductListItem
                                sku={sku}
                                showFindInStore={this.showFindInStore}
                            />
                        </React.Fragment>
                    );
                })}
            </div>
        );
    }
}

export default wrapComponent(Service, 'Service');
