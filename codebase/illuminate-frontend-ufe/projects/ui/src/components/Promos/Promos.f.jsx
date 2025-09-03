import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import bccUtils from 'utils/BCC';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import PromoItem from 'components/Product/PromoItem/PromoItem';

const { IMAGE_SIZES } = bccUtils;
const Promos = props => {
    const itemSpacing = 5;
    const promos = props.promos;

    return (
        <LegacyGrid
            marginBottom={-itemSpacing}
            gutter={itemSpacing}
        >
            {promos &&
                promos.promosList.map(promo => (
                    <LegacyGrid.Cell
                        data-at={Sephora.debug.dataAt('promo_item')}
                        key={promo.skuId}
                        display='flex'
                        width={Sephora.isMobile() ? 1 / 2 : 1 / 5}
                        paddingBottom={itemSpacing}
                    >
                        <PromoItem
                            imageSize={IMAGE_SIZES[135]}
                            imagePath={promo.image}
                            type={'promo'}
                            couponCode={promos.promoCode}
                            maxMsgSkusToSelect={promos.maxMsgSkusToSelect}
                            {...promo}
                        />
                    </LegacyGrid.Cell>
                ))}
        </LegacyGrid>
    );
};

export default wrapFunctionalComponent(Promos, 'Promos');
