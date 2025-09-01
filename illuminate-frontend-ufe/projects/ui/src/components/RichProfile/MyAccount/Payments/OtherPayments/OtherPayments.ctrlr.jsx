import React from 'react';
import ReactDom from 'react-dom';
import store from 'store/Store';
import watch from 'redux-watch';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import IconCross from 'components/LegacyIcon/IconCross';
import {
    Flex, Text, Divider, Link
} from 'components/ui';
import localeUtils from 'utils/LanguageLocale';
import profileApi from 'services/api/profile';

class OtherPayments extends BaseClass {
    state = {
        isPaypalEnabled: false
    };

    componentDidMount() {
        const basket = store.getState('basket').basket;

        if (basket.isInitialized) {
            this.setState({ isPaypalEnabled: basket.isPaypalPaymentEnabled });
        } else {
            const paypalWatch = watch(store.getState, 'basket.isPaypalPaymentEnabled');
            store.subscribe(
                paypalWatch(isPaypalPaymentEnabled => {
                    this.setState({ isPaypalEnabled: isPaypalPaymentEnabled });
                    paypalWatch();
                }),
                this
            );
        }
    }

    removePaypal = () => {
        profileApi.removePayPalFromProfile(this.props.userProfileId).then(() => {
            const element = ReactDom.findDOMNode(this);
            element.remove();
        });
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/Payments/OtherPayments/locales', 'OtherPayments');

        return (
            <div>
                <Text
                    is='p'
                    marginBottom={4}
                    lineHeight='tight'
                >
                    {getText('paypalAccount')}
                    <br />
                    {this.props.paypalEmail}
                </Text>
                {this.state.isPaypalEnabled && (
                    <div>
                        <Divider marginY={Sephora.isMobile() ? 4 : 5} />
                        <Link
                            padding={2}
                            margin={-2}
                            onClick={this.removePaypal}
                        >
                            <Flex alignItems='center'>
                                <IconCross
                                    x={true}
                                    fontSize='md'
                                />
                                <Text marginLeft={2}>{getText('removePaypal')}</Text>
                            </Flex>
                        </Link>
                    </div>
                )}
            </div>
        );
    }
}

export default wrapComponent(OtherPayments, 'OtherPayments', true);
