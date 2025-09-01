import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Icon, Text, Grid } from 'components/ui';
import Chiclet from 'components/Chiclet';
import Location from 'utils/Location';
import { mediaQueries } from 'style/config';
import { URL } from 'constants/Shared';
import Empty from 'constants/empty';
import ShopYourStoreBindings from 'analytics/bindingMethods/pages/ShopYourStore/ShopYourStoreBindings';

function ShopMyStoreChiclet(props) {
    const { shouldRender, localization, hasPreferredStore, showStoreSwitcherModal } = props;

    if (!shouldRender) {
        return null;
    }

    const handleOnClick = e => {
        e.preventDefault();

        const callback = () => Location.navigateTo(e, URL.SHOP_MY_STORE);

        if (hasPreferredStore) {
            ShopYourStoreBindings.setChicletNextPageData();
            callback();
        } else {
            showStoreSwitcherModal('home page', callback);
        }
    };

    return (
        <Chiclet
            key='shopMyStore'
            variant='shadow'
            href={URL.SHOP_MY_STORE}
            onClick={handleOnClick}
            customCSS={styles.customCSS}
        >
            <Grid
                gap={2}
                columns='1fr auto'
                alignItems='center'
            >
                <Icon
                    name='store'
                    color='black'
                    size={20}
                />

                <Text
                    textAlign='left'
                    lineHeight='14px'
                >
                    <Text
                        display='block'
                        fontSize='xs'
                        color='gray'
                        css={styles.text}
                    >
                        {localization.shop}
                    </Text>
                    <Text
                        fontSize='sm'
                        css={styles.text}
                    >
                        {localization.myStore}
                    </Text>
                </Text>
            </Grid>
        </Chiclet>
    );
}

const styles = {
    text: {
        whiteSpace: 'nowrap'
    },
    customCSS: {
        flex: '0 0 auto',
        [mediaQueries.md]: {
            display: 'none'
        }
    }
};

ShopMyStoreChiclet.propTypes = {
    localization: PropTypes.object,
    shouldRender: PropTypes.bool,
    showStoreSwitcherModal: PropTypes.func
};

ShopMyStoreChiclet.defaultProps = {
    localization: {},
    shouldRender: false,
    showStoreSwitcherModal: Empty.Function
};

export default wrapFunctionalComponent(ShopMyStoreChiclet, 'ShopMyStoreChiclet');
