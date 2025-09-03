import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Flex, Box, Text, Link
} from 'components/ui';

import CustomBulletList from 'components/Content/Happening/StoreDetails/CustomBulletList';
import Chunklets from 'components/Content/Happening/StoreDetails/Chunklets';

import LanguageLocale from 'utils/LanguageLocale';
import storeHoursUtils from 'utils/StoreHours';
import { ensureSephoraPrefix, getFormattedStoreAddress } from 'utils/happening';
import { colors } from 'style/config';

const StoreInformation = ({ store }) => {
    const getText = LanguageLocale.getLocaleResourceFile('components/Content/Happening/StoreDetails/StoreInformation/locales', 'StoreInformation');

    const {
        address, isInStoreShoppingEnabled, isBopisable, isBeautyServicesEnabled, isStoreEventsEnabled
    } = store;

    const storeName = ensureSephoraPrefix(store?.displayName);
    const isCurbsideEnabled = storeHoursUtils.isCurbsideEnabled(store);

    const storeBullets = [
        {
            bulletName: getText('inStoreShopping'),
            bulletFlag: isInStoreShoppingEnabled
        },
        {
            bulletName: getText('inStorePickup'),
            bulletFlag: isBopisable
        },
        {
            bulletName: getText('curbside'),
            bulletFlag: isCurbsideEnabled
        },
        {
            bulletName: getText('beautyServices'),
            bulletFlag: isBeautyServicesEnabled
        },
        {
            bulletName: getText('storeEvents'),
            bulletFlag: isStoreEventsEnabled
        }
    ];

    return (
        <Flex
            flexDirection='column'
            justifyContent='space-between'
            height='100%'
        >
            {/* Store Information */}
            <Flex
                marginBottom={4}
                gap={4}
                flexDirection='column'
            >
                <Text
                    is='h1'
                    fontSize={'xl'}
                    fontWeight='bold'
                    children={storeName}
                />
                <div>
                    <Text
                        is={'p'}
                        marginBottom={0}
                        children={getFormattedStoreAddress(address)}
                    />
                    <Link
                        color={colors.blue}
                        padding={1}
                        margin={-1}
                        href={`tel:${address.phone.replace(/[^0-9]+/g, '')}`}
                        children={address.phone}
                    />
                </div>
            </Flex>

            {/* Chunklets */}
            <Box marginBottom={5}>
                <Chunklets store={store} />
            </Box>

            {/* Bullets */}
            <CustomBulletList bullets={storeBullets} />
        </Flex>
    );
};

export default wrapFunctionalComponent(StoreInformation, 'StoreInformation');
