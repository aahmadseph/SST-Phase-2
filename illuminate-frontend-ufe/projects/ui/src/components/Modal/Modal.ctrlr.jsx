/* eslint-disable complexity */

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import {
    colors, modal, space, breakpoints, mediaQueries
} from 'style/config';
import { Icon } from 'components/ui';
import uiUtils from 'utils/UI';
import FocusTrap from 'focus-trap-react';
import keyConsts from 'utils/KeyConstants';
import localeUtils from 'utils/LanguageLocale';
import Header from 'components/Modal/ModalHeader';
import Title from 'components/Modal/ModalTitle';
import Body from 'components/Modal/ModalBody';
import Footer from 'components/Modal/ModalFooter';
import Back from 'components/Modal/ModalBack';
import { DebouncedResize } from 'constants/events';

const getText = localeUtils.getLocaleResourceFile('components/Modal/locales', 'Modal');

let modalRoot;
let currentPathname;

const SPEED = 300;

class Modal extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            maxHeight: null,
            showModal: false,
            isTouch: null,
            useDrawer: null,
            isFocusTrapDisabled: false
        };

        if (!Sephora.isNodeRender) {
            this.container = document.createElement('div');
        }

        this.counter = Modal.counter++;
        this.dialogRef = React.createRef();
        this.windowRef = React.createRef();
    }

    onDismiss = () => {
        this.toggleOpen(false);
        setTimeout(() => {
            this.props.onDismiss();
        }, SPEED);
    };

    toggleShowState = isOpen => {
        if (this.windowRef?.current) {
            this.windowRef.current.style.transform = '';
        }

        this.setState({ showModal: isOpen }, () => {
            if (this.props.isFlyout && this.dialogRef?.current && isOpen) {
                this.dialogRef.current.focus();
            }

            this.toggleScroll(isOpen);
        });
    };

    toggleOpen = isOpen => {
        if (isOpen) {
            modalRoot && modalRoot.appendChild(this.container);
        }

        setTimeout(() => {
            this.toggleShowState(isOpen);
        });
    };

    toggleScroll = isOpen => {
        if (modalRoot && modalRoot.childElementCount === 1) {
            if (uiUtils.isIOS()) {
                if (isOpen) {
                    uiUtils.lockBackgroundPosition();
                } else {
                    uiUtils.unlockBackgroundPosition();
                }
            } else {
                uiUtils.preventBackgroundScroll(isOpen);
            }
        }
    };

    removeContainer = () => {
        this.toggleScroll(false);
        modalRoot && modalRoot.childElementCount && modalRoot.contains(this.container) && modalRoot.removeChild(this.container);
    };

    isXSorFlyout = () => {
        return this.props.isFlyout || (this.props.isDrawer && window.matchMedia(breakpoints.xsMax).matches);
    };

    getMaxHeight = () => {
        return window.innerHeight * 0.865;
    };

    handleResize = () => {
        const { useDrawer, maxHeight } = this.state;
        const isXSorFlyout = this.isXSorFlyout();

        if (isXSorFlyout && (!useDrawer || maxHeight !== this.getMaxHeight())) {
            this.setState({
                useDrawer: true,
                maxHeight: this.getMaxHeight()
            });
        } else if (useDrawer && !isXSorFlyout) {
            this.setState({
                useDrawer: false
            });
        }
    };

    forceClose = () => {
        if (window.location.pathname !== currentPathname) {
            this.props.onDismiss();
            this.toggleOpen(false);
            this.removeContainer();
        }
    };

    componentDidMount() {
        currentPathname = window.location.pathname;
        modalRoot = document.getElementById('modal-root');
        this.setState({
            useDrawer: this.isXSorFlyout(),
            maxHeight: this.getMaxHeight(),
            isTouch: Sephora.isTouch
        });

        if (this.props.isOpen) {
            this.toggleOpen(true);
        }

        window.addEventListener(DebouncedResize, this.handleResize);
        window.addEventListener('popstate', this.forceClose);
    }

    componentDidUpdate(prevProps, prevState) {
        const { isOpen, disableFocusTrap } = this.props;

        if (prevProps.isOpen !== isOpen) {
            this.toggleOpen(isOpen);

            if (!isOpen) {
                this.removeContainer();
            }
        }

        if (prevState.isFocusTrapDisabled !== disableFocusTrap) {
            this.setState({
                isFocusTrapDisabled: disableFocusTrap
            });
        }
    }

    componentWillUnmount() {
        this.removeContainer();
        window.removeEventListener(DebouncedResize, this.handleResize);
        window.removeEventListener('popstate', this.forceClose);
    }

    handleTransitionEnd = e => {
        e.currentTarget.style.transform = 'none';
    };

    handleOnDismiss = () => {
        const { showDismiss } = this.props;

        return showDismiss ? e => this.onDismiss(e) : null;
    };

    handleOnKeyDownDismiss = () => {
        const { showDismiss } = this.props;

        if (!showDismiss) {
            return null;
        }

        return e => {
            if (e.key === keyConsts.ESC) {
                this.onDismiss(e);
            }
        };
    };

    handleStopPropagation = e => {
        e.stopPropagation();
    };

    render() {
        const {
            width,
            isFlyout,
            showDismiss,
            hasBodyScroll,
            noScroll,
            isHidden,
            formProps,
            customStyle = {},
            isGalleryLightBox = false
        } = this.props;

        const { showModal, useDrawer, isFocusTrapDisabled } = this.state;

        const styles = {
            fixed: {
                position: 'fixed',
                inset: 0,
                zIndex: isFlyout ? 'var(--layer-flyout)' : 'var(--layer-modal)'
            },
            window: {
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                transform: `translateY(${showModal ? '0' : '100%'})`,
                opacity: showModal ? 1 : 0,
                transition: `opacity ${SPEED}ms, transform ${SPEED}ms`,
                [mediaQueries.sm]: !isFlyout
                    ? {
                        alignItems: 'center',
                        transform: `translateY(${showModal ? '0' : `${space[6]}px`})`
                    }
                    : null
            },
            windowScroll: !useDrawer &&
                !hasBodyScroll &&
                !noScroll && {
                overflowX: 'hidden',
                overflowY: 'auto'
            },
            dialog: [
                useDrawer
                    ? {
                        marginTop: 'auto'
                    }
                    : {
                        width: '100%',
                        height: '100%',
                        margin: 'auto',
                        [mediaQueries.sm]: {
                            pointerEvents: 'none',
                            maxWidth: width === 'fit' ? 'max-content' : (modal.width[width] || width) + space.container * 2,
                            height: 'auto',
                            padding: `${space[5]}px ${space.container}px`
                        }
                    },
                hasBodyScroll && {
                    [mediaQueries.sm]: {
                        display: 'flex',
                        maxHeight: '100%'
                    }
                }
            ],
            inner: [
                {
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    color: colors.black,
                    backgroundColor: colors.white,
                    width: '100%',
                    outline: 0,
                    fontSize: 'var(--font-size-base)',
                    lineHeight: 'var(--leading-base)',
                    pointerEvents: 'auto'
                },
                isFlyout
                    ? {
                        paddingBottom: 'var(--bottomNavHeight)'
                    }
                    : {
                        ['@supports (bottom: env(safe-area-inset-bottom))']: {
                            paddingBottom: 'env(safe-area-inset-bottom)'
                        }
                    },
                useDrawer
                    ? {
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                        maxHeight: this.state.maxHeight
                    }
                    : {
                        minHeight: noScroll || hasBodyScroll || '100%',
                        height: (noScroll || hasBodyScroll) && '100%',
                        [mediaQueries.sm]: {
                            height: 'auto',
                            borderRadius: modal.radius
                        }
                    }
            ],
            backdrop: {
                backgroundColor: 'rgba(0,0,0,.25)',
                transition: `opacity ${SPEED}ms`
            },
            close: {
                position: 'absolute',
                top: isGalleryLightBox ? '4px' : 0,
                right: 0,
                zIndex: 3,
                lineHeight: 0,
                height: isGalleryLightBox ? '24px' : modal.headerHeight,
                paddingLeft: modal.paddingX[0],
                paddingRight: modal.paddingX[0],
                [mediaQueries.sm]: {
                    paddingLeft: modal.paddingX[1],
                    paddingRight: modal.paddingX[1]
                }
            }
        };

        const InnerComp = formProps ? 'form' : 'div';

        const idPrefix = `modal${this.counter}`;
        const dialogId = `${idPrefix}Dialog`;

        return this.props.isOpen
            ? ReactDOM.createPortal(
                <FocusTrap
                    active={!!(showModal && !isHidden && !isFlyout && !isFocusTrapDisabled)}
                    focusTrapOptions={{
                        tabbableOptions: {
                            displayCheck: 'legacy-full'
                        }
                    }}
                >
                    <div>
                        <div
                            css={[styles.fixed, styles.backdrop]}
                            style={{ opacity: showModal ? 1 : 0 }}
                        />
                        <div
                            ref={this.windowRef}
                            css={[styles.fixed, styles.window, styles.windowScroll]}
                            onTransitionEnd={this.handleTransitionEnd}
                            onClick={this.handleOnDismiss()}
                        >
                            <div
                                onClick={this.handleStopPropagation}
                                css={[styles.dialog, isHidden && { opacity: 0 }]}
                            >
                                <InnerComp
                                    ref={this.dialogRef}
                                    id={dialogId}
                                    role='dialog'
                                    aria-modal
                                    aria-labelledby={`${idPrefix}Title`}
                                    data-at={Sephora.debug.dataAt(this.props.dataAt || 'modal_dialog')}
                                    tabIndex={0}
                                    onKeyDown={this.handleOnKeyDownDismiss()}
                                    {...formProps}
                                    css={[styles.inner, customStyle.inner]}
                                >
                                    {React.Children.map(
                                        this.props.children,
                                        (child, index) =>
                                            child &&
                                              React.cloneElement(child, {
                                                  key: index.toString(),
                                                  showDismiss: showDismiss,
                                                  hasBodyScroll: hasBodyScroll || useDrawer,
                                                  idPrefix: idPrefix
                                              })
                                    )}
                                    {showDismiss && (
                                        <button
                                            type='button'
                                            aria-label={getText('closeButton')}
                                            css={styles.close}
                                            onClick={this.onDismiss}
                                            data-at={Sephora.debug.dataAt(this.props.closeDataAt || 'modal_close')}
                                        >
                                            <Icon
                                                size={modal.xSize}
                                                name='x'
                                            />
                                        </button>
                                    )}
                                </InnerComp>
                            </div>
                        </div>
                    </div>
                </FocusTrap>,
                this.container
            )
            : null;
    }
}

Modal.counter = 0;

Modal.propTypes = {
    /** Shows and hides Modal */
    isOpen: PropTypes.bool,
    /** Click event callback for the Modal background */
    onDismiss: PropTypes.func,
    /** Width override; sm+ breakpoint */
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /** scroll Modal.Body instead of the entire modal window
        requires `height` or `maxHeight` prop on Modal.Body for sm+ breakpoint */
    hasBodyScroll: PropTypes.bool,
    /** Modal transitions from and sits at bottom of viewport */
    isDrawer: PropTypes.bool,
    /** Hide close `X` button */
    showDismiss: PropTypes.bool,
    /** Remove scroll for cases where its handled with a child component */
    noScroll: PropTypes.bool,
    /* Additional styles */
    customStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
};

Modal.defaultProps = {
    isOpen: false,
    width: 2,
    showDismiss: true,
    onDismiss: function () {}
};

Modal.Header = Header;
Modal.Title = Title;
Modal.Body = Body;
Modal.Footer = Footer;
Modal.Back = Back;

export default wrapComponent(Modal, 'Modal', true);
