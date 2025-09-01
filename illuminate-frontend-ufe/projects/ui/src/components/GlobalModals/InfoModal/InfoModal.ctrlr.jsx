/* eslint-disable eqeqeq */

import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Grid, Button } from 'components/ui';
import Modal from 'components/Modal/Modal';
import userUtils from 'utils/User';
import ErrorsUtils from 'utils/Errors';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import store from 'store/Store';
import Actions from 'actions/Actions';
import basketConstants from 'constants/Basket';

const { getLocaleResourceFile } = LanguageLocaleUtils;

class InfoModal extends BaseClass {
    state = {
        isOpen: false
    };

    getText = text => getLocaleResourceFile('components/GlobalModals/locales', 'modals')(text);

    requestClose = isCancelClick => {
        const { cancelCallback } = this.props;

        store.dispatch(Actions.showInfoModal({ isOpen: false }));

        if (isCancelClick && cancelCallback && typeof cancelCallback === 'function') {
            cancelCallback();
        }
    };

    handleCancelClick = () => {
        const { cancelButtonCallback } = this.props;

        if (cancelButtonCallback && typeof cancelButtonCallback === 'function') {
            cancelButtonCallback();
        } else {
            this.requestClose(true);
        }
    };

    handleClick = () => {
        const { callback, confirmMsgObj } = this.props;

        this.requestClose();

        if (callback && typeof callback === 'function') {
            callback();
        }

        if (confirmMsgObj) {
            const confirmButtonText = 'done';
            const isMessageHTML = true;

            store.dispatch(
                Actions.showInfoModal({
                    isOpen: true,
                    title: confirmMsgObj.title,
                    message: confirmMsgObj.message,
                    buttonText: confirmButtonText,
                    showCancelButton: false,
                    isHtml: isMessageHTML
                })
            );
        }
    };

    handleDismiss = () => this.requestClose(true);

    // eslint-disable-next-line complexity
    render() {
        /* eslint-disable prefer-const */
        let {
            title,
            buttonText = this.getText('close'),
            cancelText = this.getText('cancel'),
            buttonWidth,
            isOpen,
            showCloseButton,
            showCancelButton,
            showCancelButtonLeft,
            footerColumns,
            footerDisplay = null,
            footerJustifyContent = null,
            bodyFooterPaddingX = null,
            bodyPaddingBottom = null,
            showFooterBorder = false,
            isHtml,
            message,
            dataAt,
            dataAtTitle,
            dataAtMessage,
            dataAtMessageContext,
            dataAtButton,
            dataAtCancelButton,
            dataAtClose,
            footerGridGap,
            width,
            showFooter = true
        } = this.props;

        /* eslint-enable prefer-const */
        const dataAtPopup = dataAt || null;
        const titleDataAt = title === userUtils.INFO_MODAL_WARNING_TITLE ? 'warning_pop_up_title' : dataAtTitle;
        const getMessages = () => {
            const messages = [];
            message.forEach(value => {
                messages.push(value);
                messages.push(<br />);
            });

            return messages;
        };
        const [msgTitle, msgBody] = ErrorsUtils.splitFormattedError(message);

        if (msgTitle) {
            title = msgTitle;
            message = msgBody;
        }

        const dataAtButtonContext = dataAtMessageContext === basketConstants.RESTRICTED_ITEMS_REMOVED ? 'restricted_items_close' : dataAtButton;

        const primaryButton = (
            <Button
                variant='primary'
                data-at={Sephora.debug.dataAt(dataAtButtonContext)}
                onClick={this.handleClick}
                block={true}
                children={buttonText}
                {...(buttonWidth && { width: buttonWidth })}
            />
        );

        const secondaryButton = (showCancelButton || showCancelButtonLeft) && (
            <Button
                variant='secondary'
                data-at={Sephora.debug.dataAt(dataAtCancelButton)}
                onClick={this.handleCancelClick}
                children={cancelText}
            />
        );

        return (
            <Modal
                isOpen={isOpen}
                onDismiss={this.handleDismiss}
                showDismiss={showCloseButton}
                dataAt={dataAtPopup}
                closeDataAt={dataAtClose}
                width={width || 0}
                isDrawer={true}
            >
                {title && (
                    <Modal.Header>
                        <Modal.Title data-at={Sephora.debug.dataAt(titleDataAt)}>{title}</Modal.Title>
                    </Modal.Header>
                )}
                <Modal.Body
                    padForX={!title}
                    lineHeight='tight'
                    {...(bodyFooterPaddingX && { paddingX: bodyFooterPaddingX })}
                    {...(bodyPaddingBottom && { paddingBottom: bodyPaddingBottom })}
                >
                    {isHtml ? (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: message
                            }}
                            css={styles.message}
                        />
                    ) : (
                        <div data-at={Sephora.debug.dataAt(dataAtMessage)}>{Array.isArray(message) ? getMessages() : message}</div>
                    )}
                </Modal.Body>
                {showFooter && (
                    <Modal.Footer
                        hasBorder={showFooterBorder}
                        display={showCancelButton || showCancelButtonLeft ? null : footerDisplay}
                        justifyContent={showCancelButton || showCancelButtonLeft ? null : footerJustifyContent}
                        {...(bodyFooterPaddingX && { paddingX: bodyFooterPaddingX })}
                    >
                        {secondaryButton ? (
                            <Grid
                                columns={footerColumns || 2}
                                {...(footerGridGap && { gap: footerGridGap })}
                            >
                                {showCancelButtonLeft && secondaryButton}
                                {primaryButton}
                                {showCancelButton && secondaryButton}
                            </Grid>
                        ) : (
                            primaryButton
                        )}
                    </Modal.Footer>
                )}
            </Modal>
        );
    }
}

const styles = {
    message: {
        '& p': {
            marginTop: 0,
            marginBottom: '1em'
        },
        /* No bottom margin on last paragraph */
        '& p:last-child': {
            marginBottom: 0
        }
    }
};

export default wrapComponent(InfoModal, 'InfoModal', true);
