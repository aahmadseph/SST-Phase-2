/* eslint-disable class-methods-use-this */
import React from 'react';
import constants from 'constants/content';
import anaConsts from 'analytics/constants';
import {
    Grid, Box, Flex, Divider
} from 'components/ui';

import Banner from 'components/Content/Banner';
import GoogleMap from 'components/GoogleMap/GoogleMap';
import StoreInformation from 'components/Content/Happening/StoreDetails/StoreInformation';
import HoursInformation from 'components/Content/Happening/StoreDetails/HoursInformation';
import RichText from 'components/Content/RichText';
import BaseClass from 'components/BaseClass/BaseClass';

import { wrapComponent } from 'utils/framework';
import { ensureSephoraPrefix } from 'utils/happening';
import storeHoursUtils from 'utils/StoreHours';
import { mediaQueries } from 'style/config';
import userLocation from 'utils/userLocation/UserLocation';
import GisUtil from 'utils/Gis';

const { CONTEXTS } = constants;

class StoreDetails extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            store: {
                ...this.props.store,
                distance: null
            }
        };
    }

    updateDistance = storeInfo => {
        if (storeInfo.latitude && storeInfo.longitude) {
            userLocation.determineLocation(locationObj => {
                const distance = GisUtil.getDistance(
                    locationObj.lat,
                    locationObj.lon,
                    storeInfo.latitude,
                    storeInfo.longitude,
                    GisUtil.getDefaultDistanceConfig()
                );
                typeof distance === 'number' && this.setState({ store: Object.assign({}, storeInfo, { distance: Math.ceil(distance) }) });
            });
        }
    };

    componentDidMount() {
        const { store } = this.props;

        digitalData.page.category.pageType = anaConsts.PAGE_TYPES.OLR;
        digitalData.page.pageInfo.pageName = anaConsts.PAGE_NAMES.STORE_LOCATOR;
        const storeName = ensureSephoraPrefix(store?.displayName);
        digitalData.page.attributes.world = storeName?.toLowerCase()?.startsWith('sephora') ? storeName : `sephora ${storeName}`;
        digitalData.page.attributes.experienceDetails = { storeId: store.storeId };
        digitalData.page.attributes.additionalPageInfo = 'store details';

        this.updateDistance(store);
    }

    render() {
        const { store } = this.state;

        if (!store) {
            return null;
        }

        const { curbsideInstruction = {}, banners = [] } = store;
        const isStoreTypeKohls = storeHoursUtils.isStoreTypeKohls(store);
        const showCurbsideInstructions = !isStoreTypeKohls && storeHoursUtils.isCurbsideEnabled(store) && curbsideInstruction;

        return (
            <Grid
                gridTemplateColumns={[null, null, 'repeat(2, 1fr)']}
                gridTemplateRows={[null, null, 'auto minmax(0, 1fr)']}
                gridTemplateAreas={[
                    null,
                    null,
                    !isStoreTypeKohls
                        ? '"storeInfo bannersAndMap" "hours bannersAndMap" "curbside bannersAndMap"'
                        : '"storeInfo bannersAndMap" "hours bannersAndMap"'
                ]}
                alignItems={'flex-start'}
                marginTop={[0, null, 2]}
                marginX={['-container', null, 0]}
                gap={[6, 6, '32px 25px']}
            >
                <Box
                    width='auto'
                    gridArea={[null, null, 'storeInfo']}
                    marginX={[4, null, 0]}
                >
                    <StoreInformation store={store} />
                </Box>
                <Box
                    width='100%'
                    gridArea={[null, null, 'bannersAndMap']}
                >
                    <Box marginBottom={[4, null, 5]}>
                        {!isStoreTypeKohls &&
                            banners?.map((banner, index) => (
                                <Banner
                                    {...banner}
                                    key={banner.sid}
                                    marginTop={null}
                                    marginBottom={index + 1 !== banners.length ? 2 : null}
                                    size={['100%']}
                                    context={CONTEXTS.BANNER_LIST}
                                    isRootComponent={false}
                                />
                            ))}
                    </Box>
                    <Box
                        position='relative'
                        height={[200, null, 364]}
                    >
                        <GoogleMap
                            isZoomControlShown={true}
                            ratio={9 / 16}
                            selectedStore={store}
                            showFirstMarkerInfoBox={false}
                            stores={[store]}
                            isAbsoluteFill
                        />
                    </Box>
                </Box>
                <Flex
                    width='auto'
                    marginX={[4, null, 0]}
                    gridArea={[null, null, 'hours']}
                    flexDirection='column'
                    gap={[6]}
                >
                    <Divider />
                    <HoursInformation store={store} />
                </Flex>
                {showCurbsideInstructions && (
                    <Box
                        width='auto'
                        marginTop={[5, null, 0]}
                        marginX={[4, null, 0]}
                        gridArea={[null, null, 'curbside']}
                    >
                        <RichText
                            content={curbsideInstruction}
                            style={styles}
                        />
                    </Box>
                )}
            </Grid>
        );
    }
}

const styles = {
    '& :where(p)': {
        marginBottom: 8,
        '& span > b': {
            fontSize: 16,
            lineHeight: '20px'
        },
        '& > span': {
            fontSize: 14,
            lineHeight: '18px'
        },
        [mediaQueries.md]: {
            '& span > b': {
                fontSize: 20,
                lineHeight: '22px',
                marginBottom: 8
            }
        }
    }
};

export default wrapComponent(StoreDetails, 'StoreDetails');
