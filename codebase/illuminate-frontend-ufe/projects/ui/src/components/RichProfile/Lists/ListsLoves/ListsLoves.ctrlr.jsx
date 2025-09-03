import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import LegacyCarousel from 'components/LegacyCarousel/LegacyCarousel';
import { Box, Text } from 'components/ui';
import ProductItem from 'components/Product/ProductItem';
import { space } from 'style/config';
import SkuUtils from 'utils/Sku';
import ListsHeader from 'components/RichProfile/Lists/ListsHeader';
import localeUtils from 'utils/LanguageLocale';

class ListsLoves extends BaseClass {
    constructor(props) {
        super(props);
    }

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/Lists/ListsLoves/locales', 'ListsLoves');
        const loves = this.props.loves || [];
        const isMobile = Sephora.isMobile();

        return (
            <div>
                <ListsHeader
                    dataAt={Sephora.debug.dataAt('product_carousel_title')}
                    children={getText('loves')}
                    link={loves.length > 0 ? '/shopping-list' : null}
                />
                {loves.length ? (
                    <Box marginTop={isMobile ? 4 : 5}>
                        <LegacyCarousel
                            displayCount={isMobile ? 2 : 4}
                            totalItems={loves.length}
                            carouselMaxItems={12}
                            isFlexItem={true}
                            gutter={space[5]}
                            controlHeight={this.props.imageSize}
                            showArrows={!isMobile}
                            showTouts={true}
                        >
                            {loves.map((product, index) => (
                                <ProductItem
                                    key={product.skuId}
                                    position={index}
                                    isWithBackInStockTreatment={product.actionFlags.backInStockReminderStatus !== 'notApplicable'}
                                    isCountryRestricted={SkuUtils.isCountryRestricted(product)}
                                    showQuickLook={!SkuUtils.isCountryRestricted(product)}
                                    showSignUpForEmail={true}
                                    useAddToBasket={true}
                                    showPrice={true}
                                    showMarketingFlags={true}
                                    imageSize={this.props.imageSize}
                                    rootContainerName={'loves'}
                                    isCarousel={true}
                                    {...product}
                                />
                            ))}
                        </LegacyCarousel>
                    </Box>
                ) : (
                    <Text
                        is='p'
                        lineHeight='tight'
                        fontSize={!isMobile ? 'md' : null}
                        marginTop={2}
                    >
                        {getText('viewAllLovesAddList1')}
                        {isMobile ? ' ' : <br />}
                        {getText('viewAllLovesAddList2')}
                    </Text>
                )}
            </div>
        );
    }
}

export default wrapComponent(ListsLoves, 'ListsLoves');
