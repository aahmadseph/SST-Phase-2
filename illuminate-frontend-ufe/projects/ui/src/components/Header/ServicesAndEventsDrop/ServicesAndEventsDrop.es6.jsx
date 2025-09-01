/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import Dropdown from 'components/Dropdown/Dropdown';
import StoresContent from 'components/Header/StoresContent/StoresContent';
import { Icon } from 'components/ui';
import { colors, space } from 'style/config';
import localeUtils from 'utils/LanguageLocale';

const getText = text => localeUtils.getLocaleResourceFile('components/Header/locales', 'Header')(text);

class ServicesAndEventsDrop extends BaseClass {
    state = {
        isOpen: false
    };

    render() {
        const { isOpen } = this.state;
        const { showBlackSearchHeader, items } = this.props;

        return (
            <Dropdown
                id='services_and_events_drop'
                hasMaxHeight={true}
                onTrigger={(e, isDropdownOpen) => {
                    this.setState({
                        isOpen: isDropdownOpen
                    });
                }}
            >
                <Dropdown.Trigger
                    display='flex'
                    alignItems='center'
                    paddingX={4}
                    height='100%'
                    data-at={Sephora.debug.dataAt('services_and_events_header')}
                >
                    <Icon
                        name={isOpen ? 'reservationsActive' : 'reservations'}
                        size={24}
                        marginRight={3}
                        style={{ opacity: !isOpen && !showBlackSearchHeader ? 0.6 : null }}
                    />
                    <span
                        css={isOpen && (showBlackSearchHeader ? styles.triggerLabelActiveWhite : styles.triggerLabelActive)}
                        children={getText('servicesAndEvents')}
                    />
                </Dropdown.Trigger>
                <Dropdown.Menu
                    width={this.props.dropWidth}
                    align='center'
                    paddingY={4}
                    data-at={Sephora.debug.dataAt('services_and_events_flyout_menu')}
                >
                    <StoresContent
                        items={items}
                        renderServicesAndEventsOnly
                    />
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

const styles = {
    triggerLabel: {
        marginLeft: space[3]
    },
    triggerLabelActive: {
        boxShadow: `0 2px 0 0 ${colors.black}`
    },
    triggerLabelActiveWhite: {
        boxShadow: `0 2px 0 0 ${colors.white}`
    }
};

export default wrapComponent(ServicesAndEventsDrop, 'ServicesAndEventsDrop');
