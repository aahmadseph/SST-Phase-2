import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Link } from 'components/ui';
import { colors, space } from 'style/config';
import PropTypes from 'prop-types';

function ItemSubstitutionButton({
    onClickHandler, isActive, text, showArrow, isDoNotSubstitute, ariaLabel
}) {
    return (
        <Link
            arrowDirection={showArrow ? 'right' : null}
            onClick={onClickHandler}
            fontWeight='bold'
            hoverSelector='none'
            lineHeight='none'
            css={{
                height: space[6],
                backgroundColor: 'white',
                padding: isDoNotSubstitute ? `7px ${space[2]}px` : space[2],
                borderRadius: space[1],
                border: `${isActive ? 2 : 1}px solid ${isActive ? 'black' : colors.midGray}`,
                textDecoration: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}
            tabIndex={0}
            aria-label={ariaLabel}
            aria-pressed={isActive}
            role='button'
        >
            {text}
        </Link>
    );
}

ItemSubstitutionButton.propTypes = {
    onClickHandler: PropTypes.func,
    isActive: PropTypes.bool,
    text: PropTypes.string,
    showArrow: PropTypes.bool,
    isDoNotSubstitute: PropTypes.bool
};

ItemSubstitutionButton.defaultProps = {
    onClickHandler: () => {},
    isActive: false,
    text: 'default',
    showArrow: false,
    isDoNotSubstitute: false,
    ariaLabel: ''
};

export default wrapFunctionalComponent(ItemSubstitutionButton, 'SubstitutionButton');
