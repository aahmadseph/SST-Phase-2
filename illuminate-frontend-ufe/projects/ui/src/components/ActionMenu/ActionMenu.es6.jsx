import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import Dropdown from 'components/Dropdown/Dropdown';
import { Link } from 'components/ui';
import keyConsts from 'utils/KeyConstants';

class ActionMenu extends BaseClass {
    render() {
        const {
            id,
            children,
            options,
            align,
            ariaDescribedById,
            ariaDescribedByText,
            triggerDataAt,
            menuDataAt,
            menuItemDataAt,
            preventClickOnMouseDown
        } = this.props;

        return (
            <Dropdown
                id={id}
                useClick={true}
                preventClickOnMouseDown={preventClickOnMouseDown}
            >
                <Dropdown.Trigger
                    data-at={triggerDataAt}
                    useLink={true}
                    arrowDirection='down'
                    lineHeight='tight'
                    padding={3}
                    margin={-3}
                    aria-describedby={ariaDescribedById}
                >
                    {children}
                    {ariaDescribedById && ariaDescribedByText && (
                        <span
                            id={ariaDescribedById}
                            style={{ display: 'none' }}
                            children={ariaDescribedByText}
                        />
                    )}
                </Dropdown.Trigger>
                <Dropdown.Menu
                    data-at={menuDataAt}
                    role='menu'
                    width='auto'
                    align={align}
                    fontSize='md'
                    offset={2}
                    paddingY={3}
                >
                    {options?.map((option, index) => (
                        <Link
                            data-at={menuItemDataAt}
                            key={option.children || index}
                            display='block'
                            width='100%'
                            role='menuitem'
                            paddingY={2}
                            paddingX={5}
                            css={{ whiteSpace: 'nowrap' }}
                            aria-current={option.isActive ? true : null}
                            fontWeight={option.isActive && 'bold'}
                            onKeyDown={e => this.handleKeyDown(e, index)}
                            {...option}
                        />
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    handleKeyDown = (e, index) => {
        const actions = e.target.parentNode.childNodes;
        const lastAction = actions.length - 1;

        switch (e.key) {
            case keyConsts.END:
                e.preventDefault();
                actions[lastAction].focus();

                break;
            case keyConsts.HOME:
                e.preventDefault();
                actions[0].focus();

                break;
            case keyConsts.UP:
                e.preventDefault();

                if (index === 0) {
                    actions[lastAction].focus();
                } else {
                    actions[index - 1].focus();
                }

                break;
            case keyConsts.DOWN:
            case keyConsts.TAB:
                e.preventDefault();

                if (index === lastAction) {
                    actions[0].focus();
                } else {
                    actions[index + 1].focus();
                }

                break;
            default:
                break;
        }
    };
}

ActionMenu.propTypes = {
    /** Menu id **/
    id: PropTypes.string.isRequired,
    /** Trigger content (button text) **/
    children: PropTypes.any.isRequired,
    /** Menu options; array objects must contain `children`,
        an action (`onClick`, `href`) and optionally `isActive` **/
    options: PropTypes.array.isRequired,
    /** Menu alignment **/
    align: PropTypes.oneOf(['left', 'center', 'right'])
};

export default wrapComponent(ActionMenu, 'ActionMenu');
