import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import { Box } from 'components/ui';
import keyConsts from 'utils/KeyConstants';

import Menu from 'components/Dropdown/DropdownMenu';
import Trigger from 'components/Dropdown/DropdownTrigger';
import { PostLoad } from 'constants/events';

let RootEl;
let delayedTrigger = null;

class Dropdown extends BaseClass {
    state = {
        isOpen: false,
        renderMenu: false,
        menuMaxHeight: null,
        isKeyboardUser: false
    };

    rootRef = React.createRef();
    triggerRef = React.createRef();
    menuRef = React.createRef();
    preloadCalled = false;

    render() {
        const {
            id, useClick, onTrigger, closeOnClick, children, hasCustomScroll, hasDelay, hasMaxHeight, ...props
        } = this.props;

        const childrenProps = {
            id,
            hasCustomScroll,
            isOpen: this.state.isOpen,
            triggerDropdown: this.triggerDropdown,
            triggerRef: this.triggerRef,
            menuRef: this.menuRef,
            isKeyboardUser: this.state.isKeyboardUser,
            handleMenuKeyDown: this.handleMenuKeyDown,
            handleTriggerKeyDown: this.handleTriggerKeyDown,
            renderMenu: this.state.renderMenu,
            menuMaxHeight: this.state.menuMaxHeight,
            getMenuWidth: this.getMenuWidth,
            hasDelay
        };

        return (
            <Box
                ref={this.rootRef}
                {...props}
            >
                {React.cloneElement(children[0], childrenProps)}
                {React.cloneElement(children[1], childrenProps)}
            </Box>
        );
    }

    getMenuWidth = () => {
        return this.menuRef.current?.offsetWidth;
    };

    handleResize = () => {
        if (this.rootRef && this.rootRef.current) {
            const menuHeight = window.innerHeight - this.rootRef.current.getBoundingClientRect().bottom;

            if (this.state.menuMaxHeight !== menuHeight) {
                this.setState({ menuMaxHeight: menuHeight });
            }
        }
    };

    triggerDropdown = (e, isOpen) => {
        if (isOpen) {
            this.preload();
        }

        if (!this.props.hasCustomScroll && !isOpen) {
            // reset scroll on close
            document.getElementById(this.props.id).scrollTop = 0;
        }

        this.setState({ isOpen }, () => {
            if (this.props.onTrigger) {
                this.props.onTrigger(e, isOpen);
            }
        });
    };

    preload = () => {
        if (!this.state.renderMenu) {
            this.setState({
                renderMenu: true
            });
        }

        if (this.props.hasMaxHeight) {
            this.handleResize();
        }
    };

    handleMouseEnter = e => {
        if (this.props.mouseEnterCallback) {
            this.props.mouseEnterCallback();
        }

        if (this.props.hasDelay) {
            this.preload();
            delayedTrigger = setTimeout(this.triggerDropdown.bind(this, e, true), 200);
        } else {
            this.triggerDropdown(e, true);
        }

        if (this.state.isKeyboardUser) {
            this.setState({
                isKeyboardUser: false
            });
        }
    };

    handleMouseLeave = e => {
        if (this.props.hasDelay) {
            if (delayedTrigger !== null) {
                clearTimeout(delayedTrigger);
                delayedTrigger = null;
            } else {
                return;
            }
        }

        if (this.state.isOpen) {
            this.triggerDropdown(e, false);
        }
    };

    handleInsideClick = e => {
        if (this.state.isOpen) {
            // middle click or open in new tab
            if (e?.target?.href !== undefined && (e?.button === 2 || e?.metaKey || e?.ctrlKey)) {
                return;
            }

            const isActionableTarget =
                ((e.target.href !== undefined || e?.target?.type === 'button' || e.target?.type === 'submit') &&
                    !e.target.hasAttribute('data-prevent-dropdown-closure')) ||
                Boolean(e.target.closest('.ActionableTarget'));

            if (isActionableTarget && this.props.closeOnClick) {
                this.triggerDropdown(e, false);

                if (!this.props.preventClickOnMouseDown) {
                    e?.target?.click();
                }
            }
        }
    };

    handleOutsideClick = e => {
        if (this.state.isOpen && !this.rootRef.current.contains(e.target)) {
            this.triggerDropdown(e, false);
        }
    };

    handleTriggerKeyDown = () => {
        if (!this.state.isKeyboardUser) {
            this.setState({
                isKeyboardUser: true
            });
        }
    };

    handleMenuKeyDown = e => {
        if (e.key === keyConsts.ESC) {
            this.triggerDropdown(e, false);
            this.triggerRef.current.focus();
        }
    };

    componentDidMount() {
        Sephora.Util.onLastLoadEvent(window, [PostLoad], () => {
            if (!this.preloadCalled) {
                this.preload();
                this.preloadCalled = true;
            }
        });

        RootEl = this.rootRef.current;
        RootEl.addEventListener('mousedown', this.handleInsideClick);

        if (Sephora.isTouch || this.props.useClick) {
            document.addEventListener(Sephora.isTouch ? 'touchstart' : 'mousedown', this.handleOutsideClick);
        } else {
            RootEl.addEventListener('mouseenter', this.handleMouseEnter);
            RootEl.addEventListener('mouseleave', this.handleMouseLeave);
        }
    }

    componentWillUnmount() {
        RootEl.removeEventListener('mousedown', this.handleInsideClick);

        if (Sephora.isTouch || this.props.useClick) {
            document.removeEventListener(Sephora.isTouch ? 'touchstart' : 'mousedown', this.handleOutsideClick);
        } else {
            RootEl.removeEventListener('mouseenter', this.handleMouseEnter);
            RootEl.removeEventListener('mouseleave', this.handleMouseLeave);
        }
    }
}

Dropdown.propTypes = {
    /** Menu id **/
    id: PropTypes.string.isRequired,
    /** Trigger menu via click instead of hover **/
    useClick: PropTypes.bool,
    /** Scroll menu if it exceeds viewport height **/
    hasMaxHeight: PropTypes.bool,
    /** Clicks within actionable areas within menu will close dropdown **/
    closeOnClick: PropTypes.bool,
    /** Delayed hover state **/
    hasDelay: PropTypes.bool,
    /** Enable if menu has its own scroll area **/
    hasCustomScroll: PropTypes.bool,
    mouseEnterCallback: PropTypes.func
};

Dropdown.defaultProps = {
    position: 'relative',
    closeOnClick: true,
    hasDelay: true,
    mouseEnterCallback: () => {}
};

Dropdown.Menu = Menu;
Dropdown.Trigger = Trigger;

export default wrapComponent(Dropdown, 'Dropdown', true);
