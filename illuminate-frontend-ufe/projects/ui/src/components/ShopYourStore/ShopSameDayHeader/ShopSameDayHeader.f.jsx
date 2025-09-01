import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Text, Grid, Box, Link, Image
} from 'components/ui';
import Markdown from 'components/Markdown/Markdown';
import SDUBanner from 'components/ShopYourStore/SDUBanner';
import Empty from 'constants/empty';

function ShopSameDayHeader(props) {
    const {
        localization,
        deliveryTitle,
        deliveryMessage,
        sameDayAvailable,
        notAvailableForZipCode,
        showSDUBanner,
        isUserSDUTrialEligible,
        isSDUAddedToBasket,
        bannerImageSrc,
        showShippingDeliveryLocationModal
    } = props;

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
                        <Link
                            padding={2}
                            margin={-2}
                            arrowDirection='down'
                            onClick={showShippingDeliveryLocationModal}
                        >
                            {deliveryTitle}
                        </Link>
                    </Box>
                </Grid>
                {sameDayAvailable && deliveryMessage && (
                    <Text
                        is='div'
                        color='green'
                        marginTop={[2, null, 1]}
                        children={deliveryMessage}
                    />
                )}
                {!sameDayAvailable && (
                    <Box
                        is='span'
                        marginTop={[2, null, 1]}
                    >
                        <Markdown
                            css={styles.markdown}
                            content={notAvailableForZipCode}
                        />
                        &nbsp;
                        <Link
                            padding={2}
                            margin={-2}
                            color='blue'
                            onClick={showShippingDeliveryLocationModal}
                        >
                            {localization.checkAnotherLocation}
                        </Link>
                    </Box>
                )}
                {showSDUBanner && (
                    <SDUBanner
                        isUserSDUTrialEligible={isUserSDUTrialEligible}
                        isSDUAddedToBasket={isSDUAddedToBasket}
                    />
                )}
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
    markdown: {
        display: 'inline-block'
    }
};

ShopSameDayHeader.propTypes = {
    zipCode: PropTypes.string,
    deliveryTitle: PropTypes.string,
    deliveryMessage: PropTypes.string,
    showShippingDeliveryLocationModal: PropTypes.func,
    sameDayAvailable: PropTypes.bool,
    showSDUBanner: PropTypes.bool
};

ShopSameDayHeader.defaultProps = {
    zipCode: '',
    deliveryTitle: '',
    deliveryMessage: '',
    showShippingDeliveryLocationModal: Empty.Function,
    sameDayAvailable: true,
    showSDUBanner: true
};

export default wrapFunctionalComponent(ShopSameDayHeader, 'ShopSameDayHeader');
