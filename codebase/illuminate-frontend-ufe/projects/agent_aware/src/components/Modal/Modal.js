import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import ModalHeader from 'components/Modal/ModalHeader';
import { useOnOutsideClick } from 'hooks/useOnOutsideClick';

const Modal = ({ children, onDismiss, onClose, title }) => {
    const modalRef = useRef(null);
    const modalStyles = {
        container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'fixed',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, .5)',
            zIndex: 1029,
            top: 0
        },
        content: {
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            width: '375px',
            borderRadius: '6px'
        }
    };

    useOnOutsideClick(modalRef, onDismiss);

    return ReactDOM.createPortal(
        <div
            style={modalStyles.container}
            role='dialog'
            aria-label={title}
        >
            <div
                style={modalStyles.content}
                ref={modalRef}
            >
                <ModalHeader
                    title={title}
                    onClose={onClose}
                />
                {children}
            </div>
        </div>,
        document.querySelector('body')
    );
};

export default Modal;
