import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import languageLocale from 'utils/LanguageLocale';
import Accordion from 'components/ProductPage/Accordion/Accordion';
import skuUtils from 'utils/Sku';

const getText = text => languageLocale.getLocaleResourceFile('components/ProductPage/locales', 'RwdProductPage')(text);

function HowToUse({ currentSku = {}, content }) {
    const currentSkuType = skuUtils.getProductType(currentSku);

    const isReward = currentSkuType === skuUtils.skuTypes.REWARD;
    const isSubscription = currentSkuType === skuUtils.skuTypes.SUBSCRIPTION;
    const isRougeRewardCard = currentSkuType === skuUtils.skuTypes.ROUGE_REWARD_CARD;

    const title = isSubscription || isRougeRewardCard || isReward ? getText('faq') : getText('howToUse');

    return content ? (
        <Accordion
            title={title}
            id='howtouse'
            dataAt={Sephora.debug.dataAt('how_to_use_btn')}
        >
            <div
                data-at={Sephora.debug.dataAt('how_to_use_section')}
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </Accordion>
    ) : null;
}

HowToUse.shouldUpdatePropsOn = ['currentSku.skuId', 'currentSku.actionFlags'];

export default wrapFunctionalComponent(HowToUse, 'HowToUse');
