import React from 'react';

const TYPES_OF_BUTTONS = {
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
    DISABLED: 'disabled'
};

const Button = ({ onClick, children, type = TYPES_OF_BUTTONS.PRIMARY, ...rest }) => {
    const typesOfButton = {
        [TYPES_OF_BUTTONS.PRIMARY]: {
            backgroundColor: '#000000',
            color: '#FFFFFF',
            border: '2px solid #000000',
            cursor: 'pointer'
        },
        [TYPES_OF_BUTTONS.SECONDARY]: {
            backgroundColor: '#FFFFFF',
            color: '#000000',
            border: '2px solid #000000',
            cursor: 'pointer'
        },
        [TYPES_OF_BUTTONS.DISABLED]: {
            backgroundColor: '#EEEEEE',
            color: '#666666',
            cursor: 'not-allowed'
        }
    };
    const buttonStyles = {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: typesOfButton[type].backgroundColor,
        color: typesOfButton[type].color,
        border: typesOfButton[type].border,
        cursor: typesOfButton[type].cursor,
        fontWeight: 700,
        fontSize: '14px',
        borderRadius: '30px',
        height: '45px'
    };

    return (
        <button
            style={buttonStyles}
            disabled={type === TYPES_OF_BUTTONS.DISABLED}
            onClick={onClick}
            {...rest}
        >
            {children}
        </button>
    );
};

export default Button;
