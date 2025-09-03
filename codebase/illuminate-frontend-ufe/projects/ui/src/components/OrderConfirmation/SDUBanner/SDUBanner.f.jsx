import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Text, Box } from 'components/ui';
import {
    fontSizes, fontWeights, space, colors
} from 'style/config';
import localeUtils from 'utils/LanguageLocale';
import Empty from 'constants/empty';
const getText = localeUtils.getLocaleResourceFile('components/OrderConfirmation/SDUBanner/locales', 'SDUBanner');

const SDUBanner = ({ isUS }) => {
    return (
        <>
            <Box
                css={styles.wrapper}
                width={['100%', '50%']}
            >
                <Text
                    css={styles.heading}
                    children={`${getText('welcomeMessage')} 🎉`}
                />
                <Text
                    css={styles.savingsMessage}
                    is='span'
                >
                    {`${getText('youSaved')} `}
                    <strong children={isUS ? `${getText('savingsAmountUS')} ` : `${getText('savingsAmountCA')} `} />
                    {`${getText('todaysOrder')} `}
                </Text>
            </Box>
        </>
    );
};

const styles = {
    wrapper: {
        padding: `${space[2]}px ${space[3]}px`,
        borderRadius: `${space[1]}px`,
        backgroundColor: colors.nearWhite,
        marginBottom: `${space[4]}px`,
        lineHeight: 'tight'
    },
    heading: {
        fontWeight: fontWeights.bold,
        fontSize: fontSizes.sm
    },
    savingsMessage: {
        fontSize: fontSizes.sm,
        display: 'block'
    }
};

SDUBanner.defaultProps = {
    welcomeMessage: Empty.string,
    youSaved: Empty.string,
    savingsAmount: Empty.string,
    todaysOrder: Empty.string
};

SDUBanner.propTypes = {
    welcomeMessage: PropTypes.string,
    youSaved: PropTypes.string,
    savingsAmount: PropTypes.string,
    todaysOrder: PropTypes.string
};

export default wrapFunctionalComponent(SDUBanner, 'SDUBanner');
