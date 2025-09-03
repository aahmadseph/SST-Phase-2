import React, { useCallback } from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box, Link } from 'components/ui';

function DropdownTrigger(props) {
    const {
        id, isOpen, onClick, triggerDropdown, triggerRef, handleTriggerKeyDown, useLink, ...rest
    } = props;

    const RootComp = useLink ? Link : Box;

    const handleClick = useCallback(
        e => {
            if (isOpen) {
                triggerDropdown(e, false);

                if (onClick) {
                    onClick(e);
                }
            } else {
                e.preventDefault();
                triggerDropdown(e, true);
            }
        },
        [isOpen, onClick, triggerDropdown]
    );

    return (
        <RootComp
            ref={triggerRef}
            onClick={handleClick}
            id={id + '_trigger'}
            aria-controls={id}
            aria-haspopup={true}
            aria-expanded={isOpen}
            onKeyDown={!isOpen ? handleTriggerKeyDown : null}
            {...rest}
        />
    );
}

export default wrapFunctionalComponent(DropdownTrigger, 'DropdownTrigger');
