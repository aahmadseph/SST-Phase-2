/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import { colors } from 'style/config';
import { Icon } from 'components/ui';
import Dropdown from 'components/Dropdown/Dropdown';
import StoresContent from 'components/Header/StoresContent/StoresContent';
import PreferredStore from 'components/PreferredStore/PreferredStore';
import PreferredStoreAndZipCode from 'components/ShopYourStore/PreferredStoreAndZipCode';
import StoreAndDeliveryFlyout from 'components/ShopYourStore/StoreAndDeliveryFlyout';
import StoreAndDeliverySLA from 'components/ShopYourStore/StoreAndDeliverySLA';

import localeUtils from 'utils/LanguageLocale';

const getText = text => localeUtils.getLocaleResourceFile('components/Header/locales', 'Header')(text);

class StoresDrop extends BaseClass {
    state = {
        isOpen: false
    };

    render() {
        const { isOpen } = this.state;
        const { showBlackSearchHeader, isShopYourStoreEnabled } = this.props;
        const translationKey = isShopYourStoreEnabled ? 'shopStoreAndDelivery' : 'storesAndServices';
        const Title = getText(translationKey);
        const Subtitle = isShopYourStoreEnabled ? PreferredStoreAndZipCode : PreferredStore;

        return (
            <Dropdown
                id='stores_drop'
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
                    lineHeight='tight'
                    height='100%'
                    data-at={Sephora.debug.dataAt('stores_and_services_header')}
                >
                    <Icon
                        name={isOpen ? 'storeActive' : 'store'}
                        size={24}
                        marginRight={3}
                        marginTop='-.125em'
                        style={{ opacity: !isOpen && !showBlackSearchHeader ? 0.6 : null }}
                    />
                    <span>
                        {Title}
                        <Subtitle
                            hasSephora={false}
                            maxWidth={['28ch', null, null, '46ch']}
                            display='block'
                            fontSize='xs'
                            paddingBottom={1}
                            marginBottom={-1}
                            color={isOpen || showBlackSearchHeader ? 'inherit' : 'gray'}
                            css={isOpen && (showBlackSearchHeader ? styles.triggerLabelActiveWhite : styles.triggerLabelActive)}
                        />
                    </span>
                    {isShopYourStoreEnabled && <StoreAndDeliverySLA isFlyoutOpen={isOpen} />}
                </Dropdown.Trigger>
                <Dropdown.Menu
                    width={this.props.dropWidth}
                    align='center'
                    data-at={Sephora.debug.dataAt('stores_and_services_dropdown')}
                    paddingY={isShopYourStoreEnabled ? 4 : 5}
                >
                    {isShopYourStoreEnabled ? <StoreAndDeliveryFlyout /> : <StoresContent items={this.props.items} />}
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

const styles = {
    triggerLabelActive: {
        boxShadow: `0 2px 0 0 ${colors.black}`
    },
    triggerLabelActiveWhite: {
        boxShadow: `0 2px 0 0 ${colors.white}`
    }
};

export default wrapComponent(StoresDrop, 'StoresDrop');
