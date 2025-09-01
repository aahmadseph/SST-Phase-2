import React from 'react';
import { Text, Image, Button } from 'components/ui';
import ApplePay from 'services/ApplePay';
import localeUtils from 'utils/LanguageLocale';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

//Analytics
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';

class ApplePayButton extends BaseClass {
    state = {};

    onClick = e => {
        e.stopPropagation();
        e.preventDefault();

        //Analytics
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                linkName: 'checkout:payment:applepay',
                actionInfo: 'checkout:payment:applepay',
                eventStrings: [anaConsts.Event.EVENT_71]
            }
        });

        ApplePay.onApplePayClicked(e);
    };

    render() {
        const { isApplePayPayment, children, customSvg = null, ...props } = this.props;

        const isDisabled = isApplePayPayment === ApplePay.TYPES.DISABLED;

        const getText = localeUtils.getLocaleResourceFile('components/ApplePayButton/locales', 'ApplePayButton');

        return isApplePayPayment !== ApplePay.TYPES.HIDDEN ? (
            <Button
                variant='primary'
                onClick={this.onClick}
                disabled={isDisabled}
                {...props}
            >
                <React.Fragment>
                    {customSvg ? null : (
                        <Text
                            marginRight={2}
                            fontWeight='normal'
                        >
                            {getText('checkoutWith')}
                        </Text>
                    )}
                    <Image
                        disableLazyLoad={true}
                        alt='Apple Pay'
                        src={customSvg?.src || '/img/ufe/logo-apple-pay.svg'}
                        width={customSvg?.width || 42}
                        height={customSvg?.height || 20}
                    />
                </React.Fragment>
            </Button>
        ) : (
            <div></div>
        );
    }
}

export default wrapComponent(ApplePayButton, 'ApplePayButton', true);
