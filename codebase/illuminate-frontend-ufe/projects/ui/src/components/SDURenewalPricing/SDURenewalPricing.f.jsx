import React from 'react';
import PropTypes from 'prop-types';
import FrameworkUtils from 'utils/framework';
import { Text } from 'components/ui';
import { space, colors } from 'style/config';
import localeUtils from 'utils/LanguageLocale';

const { wrapFunctionalComponent } = FrameworkUtils;
const getText = localeUtils.getLocaleResourceFile('components/SDURenewalPricing/locales', 'SDURenewalPricing');

const SDURenewalPricing = ({ hasUserSDUTrial, SDUFormattedDate, sduListPrice }) => {
    return (
        <>
            {hasUserSDUTrial && (
                <Text
                    css={styles.freeText}
                    children={`*${getText('free30DayTrial')}`}
                />
            )}
            <Text is='p'>
                <Text
                    is='span'
                    role='text'
                >
                    <Text
                        color='gray'
                        is='span'
                        display='block'
                    >
                        <strong children={hasUserSDUTrial ? `${sduListPrice} ` : `*${sduListPrice} `} />
                        {getText('annually')}
                    </Text>
                </Text>
            </Text>
            <Text is='p'>
                <Text
                    is='span'
                    role='text'
                >
                    <Text
                        css={styles.renewalDate}
                        is='span'
                    >
                        {`${hasUserSDUTrial ? getText('paymentBegins') : getText('paymentRenews')} `}
                        <strong children={`${SDUFormattedDate}`} />
                    </Text>
                </Text>
            </Text>
        </>
    );
};

const styles = {
    freeText: {
        fontWeight: 'bold',
        color: `${colors.gray}`,
        display: 'block',
        marginBottom: `${space[1]}px`
    },
    renewalDate: {
        color: `${colors.gray}`,
        display: 'block',
        marginTop: `${space[1]}px`,
        whiteSpace: 'normal'
    }
};

SDURenewalPricing.defaultProps = {};

SDURenewalPricing.propTypes = {
    hasUserSDUTrial: PropTypes.bool.isRequired,
    SDUFormattedDate: PropTypes.string.isRequired,
    sduListPrice: PropTypes.string.isRequired
};

export default wrapFunctionalComponent(SDURenewalPricing, 'SDURenewalPricing');
