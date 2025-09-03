import React from 'react';
import Flag from 'components/Flag/Flag';
import { wrapFunctionalComponent } from 'utils/framework';
import languageLocale from 'utils/LanguageLocale';
const getText = languageLocale.getLocaleResourceFile('components/OnlyFewLeftFlag/locales', 'OnlyFewLeftFlag');

function OnlyFewLeftFlag(props) {
    return (
        <Flag
            backgroundColor='red'
            children={getText('onlyFewLeftCopy')}
            {...props}
        />
    );
}

export default wrapFunctionalComponent(OnlyFewLeftFlag, 'OnlyFewLeftFlag');
