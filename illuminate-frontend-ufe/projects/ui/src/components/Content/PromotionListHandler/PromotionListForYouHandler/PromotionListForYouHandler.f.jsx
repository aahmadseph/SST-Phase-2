import React from 'react';
import PromotionList from 'components/Content/PromotionList/PromotionList';
import PromoListFallback from 'components/Bcc/BccRwdPersonalizedPromoList/PromoListFallback';
import { wrapFunctionalComponent } from 'utils/framework';

const PromotionListForYouHandler = ({ showFallback, user: { isAnonymous }, ...restProps }) => {
    if (showFallback) {
        return (
            <PromoListFallback
                isSkeleton={restProps.showSkeleton}
                isAnonymous={isAnonymous}
                enablePageRenderTracking={restProps.enablePageRenderTracking}
            />
        );
    }

    return <PromotionList {...restProps} />;
};

export default wrapFunctionalComponent(PromotionListForYouHandler, 'PromotionListForYouHandler');
