import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';

import { space } from 'style/config';
import { Box } from 'components/ui';
import FocusTrap from 'focus-trap-react';

const DropdownMenu = React.forwardRef(
    (
        {
            isOpen,
            id,
            align,
            width,
            minWidth,
            maxWidth,
            maxHeight,
            menuMaxHeight,
            isKeyboardUser,
            handleMenuKeyDown,
            offset,
            renderMenu,
            menuRef,
            hasDelay,
            hasTransition,
            getMenuWidth,
            additionalLeftMargin,
            ...props
        },
        ref
    ) => {
        const numericWidth = typeof width === 'number';
        const offsetPadding = space[offset] || offset || 0;
        const useTransition = !isKeyboardUser && hasTransition;

        const handleKeyDown = useCallback(
            e => {
                if (isOpen && isKeyboardUser) {
                    handleMenuKeyDown(e);
                }
            },
            [isOpen, isKeyboardUser, handleMenuKeyDown]
        );

        return renderMenu ? (
            <div>
                <FocusTrap active={!!(isOpen && isKeyboardUser)}>
                    <div
                        style={
                            !useTransition
                                ? { display: isOpen ? 'block' : 'none' }
                                : !isOpen
                                    ? { visibility: 'hidden', opacity: 0, transform: 'translateY(8px)' }
                                    : null
                        }
                        ref={menuRef}
                        css={[
                            styles.root,
                            {
                                width,
                                minWidth,
                                maxWidth
                            },
                            useTransition && {
                                transition: 'all .2s'
                            },
                            offset && {
                                paddingTop: offsetPadding
                            },
                            align === 'right' && {
                                left: 'auto',
                                right: 0
                            },
                            align === 'center' && {
                                left: '50%',
                                marginLeft: -(numericWidth ? width + additionalLeftMargin: getMenuWidth()) / 2
                            }
                        ]}
                    >
                        <Box
                            ref={ref}
                            id={id}
                            aria-labelledby={`${id}_trigger`}
                            onKeyDown={handleKeyDown}
                            overflowY='auto'
                            maxHeight={maxHeight || (menuMaxHeight ? menuMaxHeight - offsetPadding : null)}
                            {...props}
                        />
                    </div>
                </FocusTrap>
            </div>
        ) : null;
    }
);

const styles = {
    root: {
        position: 'absolute',
        left: 0,
        top: '100%',
        zIndex: 1
    }
};

DropdownMenu.propTypes = {
    /** Menu alignment */
    align: PropTypes.oneOf(['left', 'center', 'right']),
    /** Menu width */
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

DropdownMenu.defaultProps = {
    width: '100%',
    align: 'left',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    color: 'black',
    boxShadow: 'light',
    borderRadius: 3,
    hasTransition: true,
    additionalLeftMargin: 0
};

export default wrapFunctionalComponent(DropdownMenu, 'DropdownMenu');
