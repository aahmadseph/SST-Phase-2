import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Grid, Flex, Box, Link, Text, Image
} from 'components/ui';
import StoreShoppingOptions from 'components/ShopYourStore/StoreShoppingOptions';
import Location from 'utils/Location';
import Empty from 'constants/empty';
import { URL } from 'constants/Shared';
import { colors, space, mediaQueries } from 'style/config';

function ShopMyStoreHeader(props) {
    const {
        localization,
        storeName,
        storeClosingTime,
        isStoreClosed,
        isBopisable,
        pickupMessage,
        shoppingOptions,
        hasShoppingOptions,
        bannerImageSrc,
        targetUrl,
        showStoreSwitcherModal
    } = props;

    const handleNavigationClick = event => {
        const href = event?.currentTarget?.getAttribute('href');

        if (href) {
            Location.navigateTo(event, href);
        }
    };

    const StoreDetailsLink = ({ display }) => {
        return (
            <Link
                display={display}
                children={localization.storeDetails}
                href={targetUrl}
                onClick={handleNavigationClick}
                css={styles.link}
            />
        );
    };

    return (
        <Grid
            columns={[1, null, 2]}
            gap={7}
            height={[null, null, '312px']}
            backgroundColor={[null, null, 'nearWhite']}
        >
            <Box
                marginY={[0, null, 'auto']}
                paddingLeft={[0, null, 7]}
            >
                <Grid
                    columns={['1fr auto', null, 1]}
                    marginRight={[-2, null, 0]}
                >
                    <Box
                        is='h1'
                        fontSize={['lg', null, 'xl']}
                        fontWeight='bold'
                        lineHeight='tight'
                    >
                        {`${localization.shop} `}
                        <Link
                            padding={2}
                            margin={-2}
                            arrowDirection='down'
                            onClick={showStoreSwitcherModal}
                        >
                            {storeName}
                        </Link>
                    </Box>
                    <Box
                        display={['flex', null, 'none']}
                        alignItems='center'
                        height={space[5]}
                    >
                        <StoreDetailsLink />
                    </Box>
                </Grid>
                <Box marginTop={[2, null, 1]}>
                    <Text
                        color={isStoreClosed ? 'red' : 'green'}
                        display='block'
                        children={storeClosingTime}
                    />
                    {pickupMessage && (
                        <Text
                            color={isBopisable ? 'green' : 'gray'}
                            children={pickupMessage}
                        />
                    )}
                </Box>
                {hasShoppingOptions && <StoreShoppingOptions options={shoppingOptions} />}
                <Flex
                    marginTop={4}
                    marginLeft={-2}
                >
                    <StoreDetailsLink display={['none', null, 'block']} />
                    <Text
                        display={['none', null, 'block']}
                        is='span'
                        color='midGray'
                        children='|'
                    />
                    <Link
                        children={localization.findAStore}
                        href={URL.SEPHORA_NEAR_ME}
                        onClick={handleNavigationClick}
                        css={styles.link}
                    />
                    <Text
                        is='span'
                        color='midGray'
                        children='|'
                    />
                    <Link
                        children={localization.servicesAndEvents}
                        href={URL.HAPPENING_SERVICES}
                        onClick={handleNavigationClick}
                        css={styles.link}
                    />
                </Flex>
            </Box>
            <Box
                display={['none', null, 'block']}
                marginY='auto'
            >
                <Image
                    disableLazyLoad={true}
                    src={bannerImageSrc}
                />
            </Box>
        </Grid>
    );
}

const styles = {
    link: {
        color: colors.blue,
        padding: space[2],
        marginTop: -space[2],
        marginBottom: -space[2],
        [mediaQueries.md]: {
            color: colors.black,
            textDecoration: 'underline',
            textDecorationColor: 'rgba(0,0,0, .3)',
            transition: 'text-decoration-color .2s'
        }
    }
};

ShopMyStoreHeader.propTypes = {
    storeName: PropTypes.string,
    localization: PropTypes.object,
    isStoreClosed: PropTypes.bool,
    isBopisable: PropTypes.bool,
    storeClosingTime: PropTypes.string,
    hasShoppingOptions: PropTypes.bool,
    pickupMessage: PropTypes.string,
    targetUrl: PropTypes.string,
    showStoreSwitcherModal: PropTypes.func
};

ShopMyStoreHeader.defaultProps = {
    storeName: '',
    localization: Empty.Object,
    isStoreClosed: false,
    isBopisable: true,
    storeClosingTime: '',
    hasShoppingOptions: false,
    pickupMessage: '',
    targetUrl: '',
    showStoreSwitcherModal: Empty.Function
};

export default wrapFunctionalComponent(ShopMyStoreHeader, 'ShopMyStoreHeader');
