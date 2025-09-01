import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box } from 'components/ui';
import BccImage from 'components/Bcc/BccImage/BccImage';
import promoUtils from 'utils/Promos';

// I18n
import localeUtils from 'utils/LanguageLocale';

const getText = localeUtils.getLocaleResourceFile('components/Bcc/BccPromotion/locales', 'BccPromotion');

const BccPromotion = function (props) {
    const addPromo = () => {
        promoUtils.applyPromo(props.promoCode, null, null, true);
    };

    return (
        <Box
            maxWidth='100%'
            marginX='auto'
            onClick={addPromo}
            title={getText('addPromo')}
            aria-label={getText('addPromo')}
        >
            <BccImage {...props} />
        </Box>
    );
};

export default wrapFunctionalComponent(BccPromotion, 'BccPromotion');
