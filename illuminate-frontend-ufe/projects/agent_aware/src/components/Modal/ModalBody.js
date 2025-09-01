import React from 'react';

const ModalBody = ({ children }) => {
    const modalBodyStyles = {
        display: 'flex',
        flexDirection: 'column',
        padding: '16px'
    };

    return <div style={modalBodyStyles}>{children}</div>;
};

export default ModalBody;
