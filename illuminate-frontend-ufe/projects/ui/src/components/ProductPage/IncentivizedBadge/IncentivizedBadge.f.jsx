import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Icon } from 'components/ui';
import Tooltip from 'components/Tooltip/Tooltip';
import localeUtils from 'utils/LanguageLocale';
import {
    colors, fontSizes, lineHeights, radii
} from 'style/config';

const getText = localeUtils.getLocaleResourceFile('components/ProductPage/IncentivizedBadge/locales', 'IncentivizedBadge');

function IncentivizedBadge({ tooltipProps, isOverlay }) {
    return (
        <Tooltip
            {...tooltipProps}
            arrowOffset={localeUtils.isFrench() ? 15 : 31}
            content={getText('tooltip')}
        >
            <span css={[styles.root, isOverlay && styles.overlay]}>
                {getText('badge')}
                <Icon
                    name='infoOutline'
                    size={12}
                    marginLeft={1}
                />
            </span>
        </Tooltip>
    );
}

const styles = {
    root: {
        fontSize: fontSizes.xs,
        backgroundColor: colors.lightBlue,
        color: colors.black,
        lineHeight: lineHeights.tight,
        display: 'inline-block',
        padding: '3px 6px',
        borderRadius: radii[2],
        cursor: 'default'
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, .6)',
        color: colors.white
    }
};

IncentivizedBadge.propTypes = {
    tooltipProps: PropTypes.object,
    isOverlay: PropTypes.bool
};

IncentivizedBadge.defaultProps = {
    tooltipProps: { side: 'bottom' },
    isOverlay: false
};

export default wrapFunctionalComponent(IncentivizedBadge, 'IncentivizedBadge');
