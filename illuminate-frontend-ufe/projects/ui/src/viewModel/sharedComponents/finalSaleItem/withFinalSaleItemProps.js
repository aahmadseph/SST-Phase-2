import React from 'react';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC, wrapHOCComponent } = FrameworkUtils;
const { getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/SharedComponents/FinalSaleItem/locales', 'FinalSaleItem');

const withFinalSaleItemProps = wrapHOC(WrappedComponent => {
    const FinalSaleItemProps = props => {
        const finalSaleItemText = getText('finalSaleItem');
        const newProps = {
            ...props,
            finalSaleItemText
        };

        return <WrappedComponent {...newProps} />;
    };

    return wrapHOCComponent(FinalSaleItemProps, 'FinalSaleItemProps', [WrappedComponent]);
});

export { withFinalSaleItemProps };
