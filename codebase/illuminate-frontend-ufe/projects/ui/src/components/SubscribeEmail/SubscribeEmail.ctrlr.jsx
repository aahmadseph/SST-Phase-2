import React from 'react';
import BaseClass from 'components/BaseClass';
import FrameworkUtils from 'utils/framework';
import localeUtils from 'utils/LanguageLocale';
import Tooltip from 'components/Tooltip/Tooltip';
import { Box, Divider, Flex } from 'components/ui';
import InfoButton from 'components/InfoButton/InfoButton';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';

const { wrapComponent } = FrameworkUtils;

class SubscribeEmail extends BaseClass {
    state = {
        checked: this.props.checked
    };

    handleSubscribe = e => {
        this.setState({ checked: e.target.checked });
        this.props.onChange && this.props.onChange(e);
    };

    getValue = () => {
        return this.state.checked;
    };

    setChecked = value => {
        this.setState({ checked: value });
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/SubscribeEmail/locales', 'SubscribeEmail');

        const {
            isApplePaySignIn, disabled, checked, isCanadaCheckout, isGuestCheckout, hasDivider = true, ...props
        } = this.props;

        return (
            <>
                {hasDivider && <Divider marginTop={4} />}
                <Flex
                    flexDirection='row'
                    alignItems='center'
                >
                    <Checkbox
                        name='subscribeSephoraEmail'
                        checked={this.state.checked}
                        disabled={disabled}
                        onClick={this.handleSubscribe}
                        fontWeight='bold'
                        paddingY={4}
                        aria-describedby='subscribeSephoraEmailPopover'
                        {...props}
                    >
                        {getText('subscribeLabel')}
                    </Checkbox>
                    {localeUtils.isCanada() && (
                        <Box
                            marginLeft={2}
                            marginTop={1}
                        >
                            <Tooltip
                                paddingTop={1}
                                content={getText('popoverContent')}
                            >
                                <InfoButton />
                            </Tooltip>
                        </Box>
                    )}
                </Flex>
            </>
        );
    }
}

export default wrapComponent(SubscribeEmail, 'SubscribeEmail');
