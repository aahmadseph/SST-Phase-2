import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box } from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import ProductItem from 'components/Product/ProductItem';
import SkuUtils from 'utils/Sku';
import bccUtils from 'utils/BCC';
import SectionContainer from 'components/RichProfile/UserProfile/common/SectionContainer/SectionContainer';
import localeUtils from 'utils/LanguageLocale';

const { IMAGE_SIZES } = bccUtils;
const isDesktop = Sephora.isDesktop();
const getText = localeUtils.getLocaleResourceFile('components/RichProfile/UserProfile/common/RecentPurchases/locales', 'RecentPurchases');
const IMAGE_SIZE = IMAGE_SIZES[162];

const RecentPurchases = ({ recentPurchases }) => {
    return (
        <SectionContainer
            isMyProfile={true}
            hasDivider={true}
            title={getText('reviewRecentPurchases')}
        >
            <Box paddingX={isDesktop && 6}>
                <LegacyGrid gutter={5}>
                    {recentPurchases.map(purchase => (
                        <LegacyGrid.Cell
                            key={purchase.sku.skuId}
                            display='flex'
                            width={isDesktop ? '25%' : '50%'}
                        >
                            <ProductItem
                                rootContainerName='review recent purchases'
                                isWithBackInStockTreatment={purchase.sku.actionFlags.backInStockReminderStatus !== 'notApplicable'}
                                isCountryRestricted={SkuUtils.isCountryRestricted(purchase.sku)}
                                showSignUpForEmail={true}
                                isUseWriteReview={true}
                                showPrice={true}
                                showMarketingFlags={true}
                                imageSize={IMAGE_SIZE}
                                skuImages={purchase.sku.skuImages}
                                {...purchase.sku}
                            />
                        </LegacyGrid.Cell>
                    ))}
                </LegacyGrid>
            </Box>
        </SectionContainer>
    );
};

export default wrapFunctionalComponent(RecentPurchases, 'RecentPurchases');
