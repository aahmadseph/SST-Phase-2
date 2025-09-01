import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Link } from 'components/ui';
import languageLocale from 'utils/LanguageLocale';
import Accordion from 'components/ProductPage/Accordion/Accordion';
import Markdown from 'components/Markdown/Markdown';
import urlUtils from 'utils/Url';
import productPageBindings from 'analytics/bindingMethods/pages/productPage/productPageSOTBindings';

const { getLink } = urlUtils;
const { getLocaleResourceFile } = languageLocale;

const getText = text => getLocaleResourceFile('components/ProductPage/locales', 'RwdProductPage')(text);

function AboutTheBrand(props) {
    const {
        displayName, description, longDescription, targetUrl, brandId, productId
    } = props;

    const brandDescription = longDescription ? longDescription : description;
    const brandUrl = targetUrl ? getLink(targetUrl, ['product_about brand_']) : null;
    const brandPageUrl = brandUrl + 'visit brand lp';
    const title = getText('aboutTheBrand');

    return (
        <Accordion
            title={title}
            id='aboutTheBrand'
            dataAt={Sephora.debug.dataAt('about_the_brand_btn')}
        >
            <Markdown
                marginBottom={brandUrl && 2}
                content={brandDescription}
            />
            {brandUrl && (
                <Link
                    paddingX={2}
                    margin={-2}
                    onClick={() => {
                        productPageBindings.shopAll({ brandId, productId });
                    }}
                    color='blue'
                    href={brandPageUrl}
                    data-at={Sephora.debug.dataAt('shop_all_brand_link')}
                    children={`${getText('shopAll')} ${displayName}`}
                />
            )}
        </Accordion>
    );
}

export default wrapFunctionalComponent(AboutTheBrand, 'AboutTheBrand');
