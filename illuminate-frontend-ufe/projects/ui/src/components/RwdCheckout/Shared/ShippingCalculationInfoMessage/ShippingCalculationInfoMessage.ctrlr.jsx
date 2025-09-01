/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Text, Flex, Icon, Link
} from 'components/ui';

class ShippingCalculationInfoMessage extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            showUpdatedShippingCalculations: props.showUpdatedShippingCalculations
        };
    }

    handleHideClick = () => {
        this.setState({ showUpdatedShippingCalculations: false });
        this.props.setLocalItem();
    };

    render() {
        const { updatedShippingCalculations, gotIt } = this.props;

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
                        {updatedShippingCalculations}{' '}
                        <Link
                            color='blue'
                            underline={true}
                            onClick={this.handleHideClick}
                            children={gotIt}
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
