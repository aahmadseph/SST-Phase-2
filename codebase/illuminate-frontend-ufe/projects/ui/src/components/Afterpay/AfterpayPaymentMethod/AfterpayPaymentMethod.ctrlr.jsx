import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import DefaultPaymentCheckbox from 'components/RwdCheckout/Sections/Payment/Section/DefaultPaymentCheckbox';
import { Box, Divider, Text } from 'components/ui';
import { forms } from 'style/config';
import localeUtils from 'utils/LanguageLocale';
import mediaUtils from 'utils/Media';
const { Media } = mediaUtils;
import { colors } from 'style/config';
const AFTERPAY_WIDGET_WRAPPER_ID = 'afterpay_widget_wrapper';
const AFTERPAY_WIDGET_HEIGHT = {
    dt: '300px',
    mw: '280px'
};

class AfterpayPaymentMethod extends BaseClass {
    componentDidMount() {
        const { loadWidget, amount, widgetErrorCA, widgetErrorUS } = this.props;
        const isUS = localeUtils.isUS();
        const widgetError = isUS ? widgetErrorUS : widgetErrorCA;

        loadWidget(AFTERPAY_WIDGET_WRAPPER_ID, amount, widgetError);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.amount !== this.props.amount) {
            this.props.updateWidget(this.props.amount);
        }
    }

    render() {
        const { isAnonymous, legalNoticeUS, legalNoticeCA, isFrictionless } = this.props;
        const isUS = localeUtils.isUS();
        const legalNotice = isUS ? legalNoticeUS : legalNoticeCA;

        return (
            <>
                <Box
                    id={AFTERPAY_WIDGET_WRAPPER_ID}
                    marginY={[null, 1]}
                    maxWidth={410}
                    minHeight={[AFTERPAY_WIDGET_HEIGHT.mw, AFTERPAY_WIDGET_HEIGHT.dt]}
                    {...(isFrictionless && { marginLeft: [0, 6] })}
                ></Box>
                {!isAnonymous && (
                    <Media lessThan='sm'>
                        <Divider marginY={4} />
                    </Media>
                )}
                <Box
                    marginLeft={[null, forms.RADIO_SIZE + forms.RADIO_MARGIN]}
                    {...(isFrictionless && { marginBottom: [4, 0] })}
                >
                    {!isAnonymous && <DefaultPaymentCheckbox paymentName={'afterpay'} />}
                    <Text
                        is='p'
                        key='afterpayLegalNotice'
                        fontSize='sm'
                        css={styles.legal}
                        dangerouslySetInnerHTML={{ __html: legalNotice }}
                    />
                </Box>
            </>
        );
    }
}

const styles = {
    legal: {
        '& a': {
            color: colors.blue,
            textDecoration: 'underline'
        }
    }
};

export default wrapComponent(AfterpayPaymentMethod, 'AfterpayPaymentMethod', true);
