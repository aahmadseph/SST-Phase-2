import React from 'react';

const ModalFooter = ({ children }) => {
    const modalFooterStyles = {
        display: 'flex',
        flexDirection: 'row',
        gap: '15px',
        boxShadow: 'rgba(0, 0, 0, .2) 0px 0px 6px',
        padding: '8px 16px',
        justifyContent: 'space-between',
        textAlign: 'center'
    };

    return <div style={modalFooterStyles}>{children}</div>;
};

export default ModalFooter;
