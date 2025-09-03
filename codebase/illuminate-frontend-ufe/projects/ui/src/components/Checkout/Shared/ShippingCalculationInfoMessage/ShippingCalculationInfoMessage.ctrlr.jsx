/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Text, Flex, Icon, Link
} from 'components/ui';

import localeUtils from 'utils/LanguageLocale';
import Storage from 'utils/localStorage/Storage';
import localStorageConstants from 'utils/localStorage/Constants';

const { USER_HAS_SEEN_UPDATED_SHIPPING_CALCULATIONS: userHasSeenUpdatedShippingKey } = localStorageConstants;

class ShippingCalculationInfoMessage extends BaseClass {
    constructor() {
        super();
        this.state = {
            showUpdatedShippingCalculations: !Storage.local.getItem(userHasSeenUpdatedShippingKey)
        };
    }

    handleHideClick = () => {
        this.setState({ showUpdatedShippingCalculations: false });
        Storage.local.setItem(userHasSeenUpdatedShippingKey, true);
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile(
            'components/Checkout/Shared/ShippingCalculationInfoMessage/locales',
            'ShippingCalculationInfoMessage'
        );

        if (this.state.showUpdatedShippingCalculations) {
            return (
                <Flex
                    lineHeight='tight'
                    backgroundColor='nearWhite'
                    marginY={3}
                    paddingX={3}
                    paddingY={2}
                    borderRadius={2}
                >
                    <Icon
                        name='alert'
                        color='midGray'
                        marginRight={2}
                        size={18}
                    />
                    <Text
                        is='p'
                        flex={1}
                        alignSelf='center'
                        data-at={Sephora.debug.dataAt('warning_label')}
                    >
                        {getText('updatedShippingCalculations')}{' '}
                        <Link
                            color='blue'
                            underline={true}
                            onClick={this.handleHideClick}
                            children={getText('gotIt')}
                        ></Link>
                    </Text>
                </Flex>
            );
        } else {
            return null;
        }
    }
}

export default wrapComponent(ShippingCalculationInfoMessage, 'ShippingCalculationInfoMessage');
