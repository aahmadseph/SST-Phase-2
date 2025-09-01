import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    Box, Link, Text, Divider, Grid
} from 'components/ui';
import localeUtils from 'utils/LanguageLocale';
import storeUtils from 'utils/Store';
import urlUtils from 'utils/Url';
import StoreHours from 'components/Stores/StoreDetails/StoreHours';
import BccComponentList from 'components/Bcc/BccComponentList/BccComponentList';
import BccUtils from 'utils/BCC';

const { COMPONENT_NAMES } = BccUtils;

class FindInStoreAddress extends BaseClass {
    handleGetDirections = () => {
        const { address } = this.props;
        //needed to work properly for mobile devices
        urlUtils.openLinkInNewTab(urlUtils.getDirectionsUrl(address));

        return false;
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/GlobalModals/FindInStore/FindInStoreAddress/locales', 'FindInStoreAddress');

        const store = this.props;
        const closingTime = storeUtils.getStoreTodayClosingTime(store.storeHours);
        const showCurbsidePickupIndicator = storeUtils.isCurbsideEnabled(store);
        const [curbsideInstructionTab, curbsideMapImageTab] = storeUtils.getCurbsidePickupInstructions(store);
        const isCurbsideBccDataAvailable = !!(curbsideInstructionTab || curbsideMapImageTab);
        const showCurbsidePickupInstructions = showCurbsidePickupIndicator && isCurbsideBccDataAvailable;

        return (
            <Box
                data-at={Sephora.debug.dataAt('store_address_section')}
                lineHeight='tight'
            >
                <Text
                    is='h2'
                    fontWeight='bold'
                    data-at={Sephora.debug.dataAt('store_name_label')}
                    marginBottom={1}
                >
                    {storeUtils.getStoreDisplayNameWithSephora(store)}
                </Text>
                <Text
                    is='p'
                    data-at={Sephora.debug.dataAt('store_info_label')}
                    color='gray'
                >
                    {store.distance} {getText(localeUtils.isCanada() ? 'kilometer' : 'mile')}
                    {store.distance !== 1 ? 's ' : ' '}
                    {getText('away')}
                    <span css={{ margin: '0 .5em' }}>•</span>
                    {closingTime && closingTime !== 'Closed' ? getText('openUntil', [closingTime]) : getText('closed')}
                </Text>

                {showCurbsidePickupInstructions && (
                    <>
                        <Divider marginY={4} />
                        {curbsideInstructionTab && (
                            <BccComponentList
                                key='curbsideInstructionsText'
                                isContained={false}
                                items={curbsideInstructionTab}
                                propsCallback={function (componentType) {
                                    if (componentType === COMPONENT_NAMES.MARKDOWN) {
                                        return {
                                            css: { 'li + li': { marginTop: '.5em' } }
                                        };
                                    } else {
                                        return null;
                                    }
                                }}
                            />
                        )}
                        {curbsideMapImageTab && (
                            <BccComponentList
                                key='curbsideInstructionsImg'
                                isContained={false}
                                items={curbsideMapImageTab}
                                marginTop={4}
                                border={1}
                                borderColor='lightGray'
                                borderRadius={2}
                                overflow='hidden'
                            />
                        )}
                    </>
                )}
                <Divider marginY={4} />

                <Grid
                    columns='1fr auto'
                    alignItems='start'
                    gap={3}
                >
                    <div>
                        {store.address.address1}
                        <br />
                        {store.address.address2 ? (
                            <>
                                {store.address.address2}
                                <br />
                            </>
                        ) : null}
                        {store.address.city}, {store.address.state} {store.address.postalCode}
                        <br />
                        {store.address.country}
                        <br />
                        <Link
                            color='blue'
                            padding='1em'
                            marginX='-1em'
                            data-at={Sephora.debug.dataAt('store_phone_label')}
                            href={`tel:${store.address.phone.replace(/[^0-9]+/g, '')}`}
                        >
                            {store.address.phone}
                        </Link>
                        <br />
                        <StoreHours
                            hasBoldedDay={false}
                            storeHoursDisplay={storeUtils.getStoreHoursDisplayArray(store.storeHours)}
                        />
                    </div>
                    <Link
                        padding={2}
                        margin={-2}
                        color='blue'
                        data-at={Sephora.debug.dataAt('get_directions_btn')}
                        onClick={this.handleGetDirections}
                        children={getText('getDirections')}
                    />
                </Grid>
                {storeUtils.isStoreTypeKohls(store) && (
                    <>
                        <Divider marginY={4} />
                        <Text
                            marginTop='1em'
                            lineHeight='18px'
                            fontWeight='normal'
                            fontSize='base'
                            is='p'
                        >
                            {getText('kohlsCopy')}
                        </Text>
                    </>
                )}
                <Text
                    is='p'
                    color='red'
                    marginTop='1em'
                >
                    {store.storeHours?.closedDays?.trim()}
                </Text>
            </Box>
        );
    }
}

export default wrapComponent(FindInStoreAddress, 'FindInStoreAddress');
