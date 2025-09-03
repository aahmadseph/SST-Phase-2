/* eslint-disable object-curly-newline */

import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Link, Flex, Button, Box } from 'components/ui';
import mediaUtils from 'utils/Media';
import Modal from 'components/Modal/Modal';
import Dropdown from 'components/Dropdown/Dropdown';
import { modal } from 'style/config';
import languageLocale from 'utils/LanguageLocale';

const { Media } = mediaUtils;
const getText = languageLocale.getLocaleResourceFile('components/ProductPage/Filters/Filter/locales', 'Filter');

const convertArrayToAvailablePropObject = (arr = []) => {
    return arr.reduce((acc, item) => {
        acc[item] = true;

        return acc;
    }, {});
};

const getAvailableProps = obj => {
    const props = Object.keys(obj);

    return props.filter(prop => obj[prop]);
};

class Filter extends BaseClass {
    state = {
        isOpen: false,
        selected: convertArrayToAvailablePropObject(this.props.selected)
    };

    dropdownRef = React.createRef();

    applyFilters = () => {
        const { selected } = this.state;
        const { applyFilters, name } = this.props;
        const filtersToApply = getAvailableProps(selected);
        applyFilters({ [name]: filtersToApply });
        this.closeModalDropdown();
    };

    componentWillReceiveProps(updatedProps) {
        this.setState({
            selected: convertArrayToAvailablePropObject(updatedProps.selected)
        });
    }

    closeModalDropdown = e => {
        this.resetFilters();
        const ref = this.dropdownRef;
        this.state.isModalOpen ? this.toggleModal() : ref && ref.current && ref.current.triggerDropdown(e, false);
    };

    getFooterButtons = isDropdown => {
        return (
            <Flex
                alignItems='center'
                justifyContent='space-between'
            >
                <Link
                    is='span' // prevent closure of `dropdown`
                    color='blue'
                    data-at={Sephora.debug.dataAt('clear_btn')}
                    padding={2}
                    margin={-2}
                    onClick={this.clearFilter}
                >
                    {getText('clear')}
                </Link>
                <Button
                    variant='primary'
                    data-at={Sephora.debug.dataAt('done_btn')}
                    {...(isDropdown
                        ? {
                            size: 'sm',
                            minWidth: '10.5em'
                        }
                        : { hasMinWidth: true })}
                    onClick={this.applyFilters}
                >
                    {getText('done')}
                </Button>
            </Flex>
        );
    };

    isItemSelected = value => this.state.selected[value];

    onItemToggled = value => {
        const { isSingleSelection } = this.props;
        let selected = Object.assign({}, this.state.selected);

        if (isSingleSelection) {
            selected = {};
            selected[value] = true;
            this.setState({ selected }, () => {
                this.applyFilters();
            });
        } else {
            selected[value] = !selected[value];
            this.setState({ selected });
        }
    };

    clearFilter = () => {
        this.setState({ selected: {} });
    };

    resetFilters = () => {
        const newState = convertArrayToAvailablePropObject(this.props.selected);
        this.setState({ selected: newState });
    };

    toggleDropdown = (e, isDropdownOpen) => {
        this.setState({ isOpen: isDropdownOpen });
        this.resetFilters();
    };

    toggleModal = e => {
        this.resetFilters();
        e && e.preventDefault();
        this.setState({
            isOpen: !this.state.isOpen,
            isModalOpen: !this.state.isModalOpen
        });
    };

    render() {
        const {
            title,
            id,
            dropDownDataAt,
            sortBtnDataAt,
            isSingleSelection,
            trigger,
            content,
            width = 244,
            align = 'left',
            hasCustomScroll,
            selected: initialSelected,
            bpFilterActive
        } = this.props;
        const { isOpen, selected } = this.state;
        const tempFilters = getAvailableProps(selected);
        const isActive = ((tempFilters && tempFilters.length > 0) || (initialSelected && initialSelected.length > 0) || isOpen) && !bpFilterActive;

        return (
            <React.Fragment>
                <Media greaterThan='xs'>
                    <Dropdown
                        id={id}
                        data-at={Sephora.debug.dataAt('filter_block')}
                        ref={this.dropdownRef}
                        closeOnClick={false}
                        useClick={true}
                        onTrigger={(e, isDropdownOpen) => this.toggleDropdown(e, isDropdownOpen)}
                        hasCustomScroll={hasCustomScroll}
                    >
                        <Dropdown.Trigger
                            aria-label={title}
                            data-at={Sephora.debug.dataAt(sortBtnDataAt)}
                            css={{ outline: 0 }}
                        >
                            {trigger({
                                isActive,
                                title,
                                isSmall: false
                            })}
                        </Dropdown.Trigger>
                        <Dropdown.Menu
                            data-at={Sephora.debug.dataAt(dropDownDataAt)}
                            align={align}
                            offset={2}
                            width={width}
                            paddingTop={3}
                            paddingBottom={isSingleSelection && 3}
                        >
                            {content({
                                onClick: this.onItemToggled,
                                isSelected: this.isItemSelected
                            })}
                            {isSingleSelection || (
                                <Box
                                    marginTop={3}
                                    boxShadow='light'
                                    paddingY={2}
                                    paddingX={4}
                                    children={this.getFooterButtons(true)}
                                />
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                </Media>

                <Media at='xs'>
                    <div onClick={this.toggleModal}>
                        {trigger({
                            isActive,
                            title,
                            isSmall: true
                        })}
                    </div>
                    {this.state.isModalOpen ? (
                        <Modal
                            isOpen={true}
                            isDrawer={true}
                            onDismiss={this.toggleModal}
                        >
                            <Modal.Header>
                                <Modal.Title children={title} />
                            </Modal.Header>
                            <Modal.Body
                                paddingBottom={[isSingleSelection ? modal.paddingLg : modal.paddingSm]}
                                paddingX={null}
                            >
                                {content({
                                    onClick: this.onItemToggled,
                                    isSelected: this.isItemSelected,
                                    isModal: true
                                })}
                            </Modal.Body>
                            {isSingleSelection || <Modal.Footer children={this.getFooterButtons()} />}
                        </Modal>
                    ) : null}
                </Media>
            </React.Fragment>
        );
    }
}

export default wrapComponent(Filter, 'Filter', true);
