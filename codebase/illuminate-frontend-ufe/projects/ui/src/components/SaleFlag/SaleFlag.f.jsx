import Flag from 'components/Flag/Flag';
import React from 'react';
import LanguageLocale from 'utils/LanguageLocale';
import FrameworkUtils from 'utils/framework';

const { wrapFunctionalComponent } = FrameworkUtils;
const { getLocaleResourceFile } = LanguageLocale;
const getText = getLocaleResourceFile('components/SaleFlag/locales', 'SaleFlag');

function SaleFlag(props) {
    return (
        <Flag
            backgroundColor='red'
            children={getText('saleCopy')}
            {...props}
        />
    );
}

export default wrapFunctionalComponent(SaleFlag, 'SaleFlag');
