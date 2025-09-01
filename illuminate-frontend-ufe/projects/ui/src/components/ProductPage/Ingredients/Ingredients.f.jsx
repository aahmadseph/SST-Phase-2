import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import languageLocale from 'utils/LanguageLocale';
import Accordion from 'components/ProductPage/Accordion/Accordion';

const getText = text => languageLocale.getLocaleResourceFile('components/ProductPage/locales', 'RwdProductPage')(text);

function Ingredients({ content }) {
    return content ? (
        <Accordion
            title={getText('ingredients')}
            id='ingredients'
            dataAt='ingredients'
        >
            <div dangerouslySetInnerHTML={{ __html: content }} />
        </Accordion>
    ) : null;
}

export default wrapFunctionalComponent(Ingredients, 'Ingredients');
