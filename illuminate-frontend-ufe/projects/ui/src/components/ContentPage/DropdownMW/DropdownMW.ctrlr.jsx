import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import { Box, Link } from 'components/ui';
import Modal from 'components/Modal/Modal';
import navClickBindings from 'analytics/bindingMethods/pages/all/navClickBindings';
import localeUtils from 'utils/LanguageLocale';
import urlUtils from 'utils/Url';

class DropdownMW extends BaseClass {
    state = { isActive: false };

    toggleModal = () => {
        this.setState({ isActive: !this.state.isActive });
    };

    navigateTo = url => {
        urlUtils.redirectTo(url);
    };

    buildDropdownNavigation = props => {
        const getText = localeUtils.getLocaleResourceFile('components/ContentPage/DropdownMW/locales', 'DropdownMW');

        const list = [];
        const properties = {};
        const navItems = props.navItems;

        for (const comp of navItems[0].ancestorHierarchy) {
            properties.onClick = e => {
                e.preventDefault();
                navClickBindings.trackNavClick(['left nav', props.title, comp.displayName]);
                this.navigateTo(comp.targetScreen.targetUrl);
            };

            list.push(
                <Link
                    {...properties}
                    display='block'
                    width='100%'
                    paddingY={3}
                    lineHeight='tight'
                >
                    {`${props.title} ${getText('in')} ${comp.displayName}`}
                </Link>
            );
        }

        return list;
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/ContentPage/DropdownMW/locales', 'DropdownMW');

        const dropDownItems = this.buildDropdownNavigation(this.props);

        return (
            <div>
                <Box
                    borderBottom={1}
                    borderColor='divider'
                >
                    <Link
                        display='block'
                        width='100%'
                        textAlign='center'
                        arrowDirection='down'
                        arrowPosition='after'
                        paddingY={4}
                        onClick={this.toggleModal}
                    >
                        {`${getText('all')} ${this.props.title}`}
                    </Link>
                </Box>

                <Modal
                    isOpen={this.state.isActive}
                    onDismiss={this.toggleModal}
                >
                    <Modal.Header>
                        <Modal.Title>
                            <Link
                                arrowPosition='before'
                                arrowDirection='left'
                                onClick={this.toggleModal}
                                children={`${getText('all')} ${this.props.title}`}
                            />
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{dropDownItems}</Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default wrapComponent(DropdownMW, 'DropdownMW');
