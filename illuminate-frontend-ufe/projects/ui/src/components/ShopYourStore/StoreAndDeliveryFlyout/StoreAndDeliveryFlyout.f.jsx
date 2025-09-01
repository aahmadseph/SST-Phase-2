import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import Action from 'components/Content/Action';
import {
    Text, Box, Grid, Link, Flex, Divider, Image
} from 'components/ui';
import Button from 'components/Button';
import StoreShoppingOptions from 'components/ShopYourStore/StoreShoppingOptions';
import { space } from 'style/config';
import { URL } from 'constants/Shared';
import Location from 'utils/Location';
import Empty from 'constants/empty';
import { ELEMENTS_IDS } from 'constants/ShopYourStore';
import ShopYourStoreBindings from 'analytics/bindingMethods/pages/ShopYourStore/ShopYourStoreBindings';

const ActionBox = Action(Box);
const BUTTON_WIDTH = '130px';
const LINK_MAX_WIDTH = '48px';

function StoreAndDeliveryFlyout(props) {
    const {
        localization,
        hasPreferredStore,
        hasPreferredZipCode,
        storeName,
        address1,
        address2,
        city,
        state,
        postalCode,
        isStoreClosed,
        storeClosingTime,
        targetUrl,
        shoppingOptions,
        hasShoppingOptions,
        happeningLinks,
        onDismiss,
        showStoreSwitcherModal,
        showShippingDeliveryLocationModal,
        sameDayDeliveryTo,
        pickupMessage,
        deliveryMessage,
        shopSameDay
    } = props;

    const handleNavigationClick = event => {
        const href = event?.currentTarget?.getAttribute('href');
        const elementId = event?.target?.id;

        // linkData - prop55 for next page load
        ShopYourStoreBindings.setFlyoutNextPageData(elementId);

        if (href) {
            Location.navigateTo(event, href);
        }

        // Callback will close the MyStoreModal after
        // user navigates to other page in Small UI.
        onDismiss();
    };

    const handleHappeningLinksNavigationClick = () => {
        const elementId = ELEMENTS_IDS.SERVICES_EVENTS;

        // linkData - prop55 for next page load
        ShopYourStoreBindings.setFlyoutNextPageData(elementId);

        // Callback will close the MyStoreModal after
        // user navigates to other page in Small UI.
        onDismiss();
    };

    return (
        <Box
            paddingX={[0, 4]}
            lineHeight='tight'
        >
            {hasPreferredStore ? (
                <div key='preferredStore'>
                    <Grid
                        columns='1fr auto'
                        gap={1}
                    >
                        <dl data-at={Sephora.debug.dataAt('store_info')}>
                            <dt data-at={Sephora.debug.dataAt('store_name')}>
                                <Link
                                    fontSize='md'
                                    fontWeight='bold'
                                    children={storeName}
                                    arrowDirection='down'
                                    onClick={showStoreSwitcherModal}
                                />
                            </dt>
                            <dd>{address1}</dd>
                            {address2 && <dd>{address2}</dd>}
                            <dd>{`${city}, ${state} ${postalCode}`}</dd>
                        </dl>
                        <Button
                            id={ELEMENTS_IDS.SHOP_MY_STORE}
                            size='sm'
                            variant='primary'
                            width={BUTTON_WIDTH}
                            href={URL.SHOP_MY_STORE}
                            onClick={handleNavigationClick}
                        >
                            {localization.shopThisStore}
                        </Button>
                    </Grid>
                    <dl css={styles.closingTimeAndSLA}>
                        <dd css={[isStoreClosed ? styles.redText : styles.greenText]}>{storeClosingTime}</dd>
                        {pickupMessage && <dd css={styles.greenText}>{pickupMessage}</dd>}
                    </dl>
                    {hasShoppingOptions && <StoreShoppingOptions options={shoppingOptions} />}
                    {happeningLinks && happeningLinks.length > 0 && (
                        <Box
                            marginY={4}
                            gap={4}
                            display={['grid', null, 'none']}
                            gridTemplateColumns='repeat(3, 1fr)'
                        >
                            {happeningLinks.map((item, index) => {
                                return (
                                    <ActionBox
                                        dontUseInternalTracking
                                        key={item.sid || `link-${index}`}
                                        sid={item.action?.sid}
                                        action={item.action}
                                        onClick={handleHappeningLinksNavigationClick}
                                        maxWidth={LINK_MAX_WIDTH}
                                    >
                                        {item.media?.src && (
                                            <Image
                                                display='block'
                                                marginBottom={2}
                                                src={item.media.src}
                                                size={LINK_MAX_WIDTH}
                                            />
                                        )}
                                        {item.label}
                                    </ActionBox>
                                );
                            })}
                        </Box>
                    )}
                </div>
            ) : (
                <Grid
                    key='noPreferredStore'
                    columns='1fr auto'
                    gap={1}
                >
                    <div>
                        <Text
                            fontSize='md'
                            fontWeight='bold'
                            children={localization.shopYourStore}
                        />
                        <Text
                            display='block'
                            children={localization.chooseStoreToBegin}
                        />
                    </div>
                    <Button
                        size='sm'
                        variant='primary'
                        width={BUTTON_WIDTH}
                        onClick={showStoreSwitcherModal}
                    >
                        {localization.chooseStore}
                    </Button>
                </Grid>
            )}
            <Flex
                marginTop={4}
                marginLeft={-2}
            >
                <Link
                    id={ELEMENTS_IDS.STORE_DETAILS}
                    display={hasPreferredStore ? 'block' : 'none'}
                    padding={2}
                    marginY={-2}
                    color='blue'
                    children={localization.storeDetails}
                    href={targetUrl}
                    onClick={handleNavigationClick}
                />
                <Text
                    display={hasPreferredStore ? 'block' : 'none'}
                    is='span'
                    color='midGray'
                    children='|'
                />
                <Link
                    id={ELEMENTS_IDS.FIND_SEPHORA}
                    padding={2}
                    marginY={-2}
                    color='blue'
                    children={localization.findASephora}
                    href={URL.SEPHORA_NEAR_ME}
                    onClick={handleNavigationClick}
                />
            </Flex>
            <Box display={['none', null, 'block']}>
                <Divider
                    marginY={4}
                    marginX={-4}
                    height={3}
                    color='nearWhite'
                />
                {hasPreferredZipCode ? (
                    <div key='preferredZipCode'>
                        <Grid
                            columns='1fr auto'
                            gap={1}
                        >
                            <Link
                                fontSize='md'
                                fontWeight='bold'
                                children={sameDayDeliveryTo}
                                arrowDirection='down'
                                onClick={showShippingDeliveryLocationModal}
                            />
                            <Button
                                id={ELEMENTS_IDS.SHOP_SAME_DAY}
                                size='sm'
                                variant='primary'
                                width={BUTTON_WIDTH}
                                href={URL.SHOP_SAME_DAY}
                                onClick={handleNavigationClick}
                            >
                                {shopSameDay}
                            </Button>
                        </Grid>
                        {deliveryMessage && (
                            <dl css={styles.closingTimeAndSLA}>
                                <dd css={styles.greenText}>{deliveryMessage}</dd>
                            </dl>
                        )}
                    </div>
                ) : (
                    <Grid
                        key='noPreferredZipCode'
                        columns='1fr auto'
                        gap={1}
                    >
                        <div>
                            <Text
                                fontSize='md'
                                fontWeight='bold'
                                children={localization.shopSameDayDelivery}
                            />
                            <Text
                                display='block'
                                children={localization.chooseLocationToBegin}
                            />
                        </div>
                        <Button
                            size='sm'
                            variant='primary'
                            width={BUTTON_WIDTH}
                            onClick={showShippingDeliveryLocationModal}
                        >
                            {localization.chooseLocation}
                        </Button>
                    </Grid>
                )}
            </Box>
        </Box>
    );
}

const styles = {
    closingTimeAndSLA: { marginTop: space[1] },
    greenText: {
        color: 'green'
    },
    redText: {
        color: 'red'
    },
    shoppingOptions: { flex: '0 0 auto' }
};

StoreAndDeliveryFlyout.propTypes = {
    localization: PropTypes.object,
    storeName: PropTypes.string,
    sameDayDeliveryTo: PropTypes.string,
    hasPreferredStore: PropTypes.bool,
    hasPreferredZipCode: PropTypes.bool,
    hasShoppingOptions: PropTypes.bool,
    happeningLinks: PropTypes.array,
    showStoreSwitcherModal: PropTypes.func,
    showShippingDeliveryLocationModal: PropTypes.func,
    onDismiss: PropTypes.func
};

StoreAndDeliveryFlyout.defaultProps = {
    localization: {},
    storeName: '',
    sameDayDeliveryTo: '',
    hasPreferredStore: false,
    hasPreferredZipCode: false,
    hasShoppingOptions: false,
    happeningLinks: Empty.Array,
    showStoreSwitcherModal: Empty.Function,
    showShippingDeliveryLocationModal: Empty.Function,
    onDismiss: Empty.Function
};

export default wrapFunctionalComponent(StoreAndDeliveryFlyout, 'StoreAndDeliveryFlyout');
