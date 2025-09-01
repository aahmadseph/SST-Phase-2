import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Image, Text } from 'components/ui';

function BottomNavButton({
    label, inactiveIcon, activeIcon, isActive, onClick, dataAt, css, ...props
}) {
    const iconObj = isActive && activeIcon ? activeIcon : inactiveIcon;
    const iconSrc = iconObj?.src ?? iconObj?.url ?? (typeof iconObj === 'string' ? iconObj : '');
    const truncatedLabel = label?.length > 10 ? label.slice(0, 10) + '…' : label;

    return (
        <button
            onClick={onClick}
            data-at={Sephora.debug.dataAt('bottom_nav_link')}
            css={css}
            {...props}
        >
            {iconSrc ? (
                <Image
                    src={iconSrc}
                    disableLazyLoad={true}
                    size={24}
                    alt='Bottom Navigation'
                />
            ) : null}
            <Text css={styles.buttonLabel}>{truncatedLabel}</Text>
        </button>
    );
}

const styles = {
    buttonLabel: {
        marginTop: '5.5px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        verticalAlign: 'bottom'
    }
};

BottomNavButton.propTypes = {
    label: PropTypes.string,
    isActive: PropTypes.bool,
    onClick: PropTypes.func
};

BottomNavButton.defaultProps = {
    label: '',
    isActive: false,
    onClick: () => {}
};

export default wrapFunctionalComponent(BottomNavButton, 'BottomNavButton');
