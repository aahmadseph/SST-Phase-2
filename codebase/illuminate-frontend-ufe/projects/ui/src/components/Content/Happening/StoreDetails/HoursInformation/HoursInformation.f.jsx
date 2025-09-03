import React, { Fragment } from 'react';
import framework from 'utils/framework';
import { Text, Divider, Flex } from 'components/ui';
import HoursGrid from 'components/Content/Happening/StoreDetails/HoursInformation/HoursGrid';
import storeHoursUtils from 'utils/StoreHours';

const { wrapFunctionalComponent } = framework;

const HoursInformation = ({ store }) => {
    const { storeHours, curbsideHours } = store;

    if (!storeHours && !curbsideHours) {
        return null;
    }

    const { storeHoursDisplay, curbsideHoursDisplay } = storeHoursUtils.getStoreHoursDisplay(store);
    const isStoreTypeKohls = storeHoursUtils.isStoreTypeKohls(store);
    const storeSpecialMessage = storeHoursUtils.getStoreSpecialMessage(store?.storeSpecialMessage, isStoreTypeKohls);
    const isCurbsideEnabled = storeHoursUtils.isCurbsideEnabled(store);

    const { specialStoreHours, curbsideSpecialStoreHours } = storeHoursUtils.getSpecialStoreHours(store);

    const showSpecialStoreHours = !!specialStoreHours?.length;
    const showCurbsideSpecialStoreHours = !isStoreTypeKohls && !!curbsideSpecialStoreHours?.length;
    const showSpecialSeccion = showSpecialStoreHours || showCurbsideSpecialStoreHours;

    return (
        <>
            <Flex
                width='auto'
                flexDirection='column'
                gap={[2, 2, 5]}
            >
                <HoursGrid timeRange={storeHoursDisplay} />
                {!isStoreTypeKohls && isCurbsideEnabled && <HoursGrid timeRange={curbsideHoursDisplay} />}
            </Flex>
            {showSpecialSeccion && (
                <Flex
                    width='auto'
                    flexDirection='column'
                    gap={[5]}
                    padding={[4]}
                    borderRadius={[2]}
                    backgroundColor='#FFF'
                    boxShadow='0px 0px 6px 0px rgba(0, 0, 0, 0.20)'
                >
                    {showSpecialStoreHours && <HoursGrid timeRange={specialStoreHours} />}
                    {showCurbsideSpecialStoreHours && <HoursGrid timeRange={curbsideSpecialStoreHours} />}
                </Flex>
            )}
            {!!storeSpecialMessage?.length &&
                storeSpecialMessage.map(({ message, color }, index) => (
                    <Fragment key={index}>
                        <Divider />
                        <Text
                            is='p'
                            children={message}
                            color={color}
                        />
                    </Fragment>
                ))}
            {!isStoreTypeKohls && <Divider />}
        </>
    );
};

export default wrapFunctionalComponent(HoursInformation, 'HoursInformation');
