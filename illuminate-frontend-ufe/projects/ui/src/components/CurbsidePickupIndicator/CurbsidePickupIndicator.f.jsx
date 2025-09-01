import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Grid, Icon } from 'components/ui';
import LanguageLocale from 'utils/LanguageLocale';

const { getLocaleResourceFile } = LanguageLocale;
const getText = getLocaleResourceFile('components/CurbsidePickupIndicator/locales', 'CurbsidePickupIndicator');

function CurbsidePickupIndicator({
    children, dataAt, iconName, iconColor, ...GridProps
}) {
    const text = children || getText('curbsidePickupAvailable');

    return (
        <Grid
            gap='1'
            alignItems='center'
            columns='auto 1fr'
            {...GridProps}
        >
            <Icon
                name={iconName}
                color={iconColor}
                size='1em'
            />
            <span
                key='textWrapper'
                data-at={Sephora.debug.dataAt(dataAt)}
            >
                {text}
            </span>
        </Grid>
    );
}

CurbsidePickupIndicator.defaultProps = {
    fontSize: 'sm',
    color: 'gray',
    iconName: 'checkmark',
    iconColor: 'green'
};

CurbsidePickupIndicator.propTypes = {
    fontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    color: PropTypes.string,
    iconName: PropTypes.string,
    dataAt: PropTypes.string,
    iconColor: PropTypes.string
};

export default wrapFunctionalComponent(CurbsidePickupIndicator, 'CurbsidePickupIndicator');
