import React from 'react';

import { wrapFunctionalComponent } from 'utils/framework';
import { colors, modal } from 'style/config';
import {
    Divider, Grid, Text, Link
} from 'components/ui';
import InfoButton from 'components/InfoButton/InfoButton';
import CurbsidePickupIndicator from 'components/CurbsidePickupIndicator';
import ConciergeCurbsidePickupIndicator from 'components/ConciergeCurbsidePickupIndicator';
import Radio from 'components/Inputs/Radio/Radio';
import storeUtils from 'utils/Store';
import Location from 'utils/Location';
import Flag from 'components/Flag/Flag';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import localeUtils from 'utils/LanguageLocale';
import StoreSelectorModalBindings from 'analytics/bindingMethods/components/globalModals/storeSelectorModal/StoreSelectorModalBindings';

const { getLocaleResourceFile } = LanguageLocaleUtils;
const getText = (text, vars) => getLocaleResourceFile('components/GlobalModals/ReserveAndPickUpModal/locales', 'StoresList')(text, vars);
const OUT_OF_STOCK = 'out of stock';
const KOHLS_LINK = 'https://www.kohls.com/sale-event/sephora-at-kohls.jsp?icid=fromSephora';
const availabilityStringMapping = {
    'in stock': 'inStock',
    'out of stock': 'outOfStock',
    'limited stock': 'limitedStock'
};

const pickupBadge = pickUpAvailability => {
    const badges = {
        ROPIS: getText('payInStore'),
        BOPIS: getText('payOnline'),
        DEFAULT: null
    };

    const badge = badges[pickUpAvailability];

    if (badge) {
        return badges[pickUpAvailability].toUpperCase();
    } else {
        return badges.DEFAULT;
    }
};

function StoresList({
    stores, selectedStore, handleStoreSelection, openModal, disableNonBopisStores, disableOutOfStockStores, skuId = ''
}) {
    /* eslint-disable-next-line complexity */
    const list = stores.map((store, index) => {
        const isRopisable = store.isRopisable;
        const isBopisable = store.isBopisable;
        const isPickup = store.isRopisable || store.isBopisable;
        const availability = store.availabilityStatus;
        const isOOS = availability.toLowerCase() === OUT_OF_STOCK;
        const isBOPISEnabled = Sephora.configurationSettings.isBOPISEnabled;
        const isROPISEnabled = Sephora.configurationSettings.isROPISEnabled;
        const isBopisOn = isBopisable && isBOPISEnabled;
        const isRopisOn = isRopisable && isROPISEnabled;
        const isPickUpAvailable = isBopisOn || isRopisOn;
        const shouldDisplayPaymentTag = isBOPISEnabled && isPickup;
        const curbsidePickupFlag = storeUtils.isCurbsideEnabled(store);
        const showConciergeCurbsidePickupIndicator = storeUtils.isConciergeCurbsideEnabled(store);
        const showCurbsidePickupIndicator = curbsidePickupFlag && !showConciergeCurbsidePickupIndicator;
        const isKohlsStore = storeUtils.isStoreTypeKohls(store);
        let pickUpAvailability = 'NON_PICKUP';

        if (isRopisable) {
            pickUpAvailability = 'ROPIS';
        }

        if (isBopisable) {
            pickUpAvailability = 'BOPIS';
        }

        const todayClosingTime = storeUtils.getStoreTodayClosingTime(store.storeHours);

        return (
            <React.Fragment key={`store_${store.storeId}`}>
                {index > 0 && (
                    <Divider
                        marginY={4}
                        marginX={modal.outdentX}
                    />
                )}
                <Grid
                    alignItems='flex-start'
                    columns='1fr auto'
                    marginTop={index === 0 && 4}
                >
                    <div data-at={Sephora.debug.dataAt('store_data')}>
                        <Radio
                            paddingY={null}
                            css={(selectedStore || {}).storeId !== store.storeId && { ':hover .StoreList-name': { textDecoration: 'underline' } }}
                            dataAt={'radio_dot_store'}
                            disabled={(disableNonBopisStores && !isBopisable) || (disableOutOfStockStores && isOOS) || isKohlsStore}
                            checked={(selectedStore || {}).storeId === store.storeId}
                            onChange={e => handleStoreSelection(e, store)}
                            alignItems='start'
                        >
                            <dl css={{ color: colors.black }}>
                                <dt>
                                    <strong
                                        className='StoreList-name'
                                        data-at={Sephora.debug.dataAt('store_name_label')}
                                    >
                                        {index + 1}. {storeUtils.getStoreDisplayNameWithSephora(store)}
                                    </strong>
                                </dt>
                                {shouldDisplayPaymentTag && (
                                    <dd>
                                        <Flag
                                            backgroundColor='lightBlue'
                                            color='black'
                                            children={pickupBadge(pickUpAvailability)}
                                        />
                                    </dd>
                                )}
                                {isKohlsStore && !isOOS && (
                                    <Text
                                        marginTop={2}
                                        marginBottom={2}
                                        color='gray'
                                        lineHeight='14px'
                                        fontWeight='normal'
                                        fontSize='sm'
                                        is='dd'
                                    >
                                        {getText('goTo')}
                                        <Link
                                            color='blue'
                                            href={KOHLS_LINK}
                                            children={'kohls.com'}
                                            onClick={e => {
                                                e.preventDefault();
                                                StoreSelectorModalBindings.triggerAnalytics(availability?.toLowerCase(), store.storeId, skuId);
                                                Location.setLocation(KOHLS_LINK);
                                            }}
                                        />
                                        {getText('kohlsCopy')}
                                    </Text>
                                )}
                                <dd css={[{ margin: '.25em 0' }, isPickUpAvailable || { color: colors.gray }]}>
                                    <strong
                                        css={(isPickUpAvailable || isKohlsStore) && { color: isOOS ? colors.red : colors.green }}
                                        children={getText(availabilityStringMapping[availability.toLowerCase()])}
                                    />
                                    {isPickUpAvailable || isKohlsStore ? null : getText('pickupNotOffered')}
                                </dd>

                                <dd>{store.address.address1}</dd>
                                {store.address.address2 && <dd>{store.address.address2}</dd>}
                                <dd>
                                    {store.address.city}
                                    {', '}
                                    {store.address.state} {store.address.postalCode}
                                </dd>
                                <dd css={{ marginTop: '.75em' }}>
                                    {todayClosingTime && todayClosingTime !== 'Closed' ? getText('openUntil', [todayClosingTime]) : getText('closed')}
                                    <span css={{ margin: '0 .5em' }}>•</span>
                                    {store.distance} {localeUtils.isCanada() ? getText('kmAway') : getText('milesAway')}
                                </dd>
                                {showCurbsidePickupIndicator && (
                                    <CurbsidePickupIndicator
                                        marginTop={'0.75em'}
                                        is='dd'
                                        dataAt='store_curbside_indicator_label'
                                    />
                                )}
                                {showConciergeCurbsidePickupIndicator && (
                                    <ConciergeCurbsidePickupIndicator
                                        dataAt={
                                            Sephora.isMobile()
                                                ? 'concierge_curbside_indicator_stores_modal_label'
                                                : 'concierge_curbside_indicator_flyout_label'
                                        }
                                        is='dd'
                                        marginTop='0.75em'
                                    />
                                )}
                            </dl>
                        </Radio>
                    </div>
                    <InfoButton
                        size={20}
                        dataAt={'store'}
                        onClick={function () {
                            openModal({
                                isOpen: true,
                                currentProduct: null,
                                selectedStore: store,
                                showBackButton: true
                            });
                        }}
                    />
                </Grid>
            </React.Fragment>
        );
    });

    return <div>{list}</div>;
}

export default wrapFunctionalComponent(StoresList, 'StoresList');
