import React from 'react';
import framework from 'utils/framework';
import localeUtils from 'utils/LanguageLocale';

const { wrapHOC, wrapHOCComponent } = framework;

const withLocaleInfo = wrapHOC(WrappedComponent => {
    const LocaleInfo = props => {
        const isCanada = localeUtils.isCanada();
        const isUS = localeUtils.isUS();

        return (
            <WrappedComponent
                {...props}
                isCanada={isCanada}
                isUS={isUS}
            />
        );
    };

    return wrapHOCComponent(LocaleInfo, 'LocaleInfo', [WrappedComponent]);
});

export default withLocaleInfo;
